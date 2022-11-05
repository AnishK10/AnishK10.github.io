from typing import Optional
from pydantic import BaseModel
from deta import Deta
from fastapi import APIRouter, HTTPException, status, Request


# iaau4j
# Project Key: iaau4j
# c0wuhtze_24XTS646UKrhPkjQYc4j28CtvhHrpHBn

deta = Deta('c0wuhtze_24XTS646UKrhPkjQYc4j28CtvhHrpHBn')  # configure your Deta project

route_db = deta.Base('ET_RouteDB')  # access your DB
"""
    This is the main routes db 
    Schema: 
        {
            "key": "route_name",     # Eg: /shlok
            "route": "shlok",   # This will be same as key (Temp stored extra)
            "is_protected": 0 / 1,    # True if route is protected
            "password": "password",  # Password for protected route else ""
        } 
"""

transaction_db = deta.Base('ET_TransactionDB')  # access your DB
"""
    This is the main transaction db
    Schema:
        {
            # Auto generated
            "key": "transaction_id",                        
            
            # Route name to which this transaction belongs to
            "route": "shlok",                               

            # Title of the transaction
            "title": "Title",                         
                  
            # Description of the transaction
            "description": "Desc",                          
            
             # Amount of the transaction
            "amount": "Amount",                            
            
            # Tags of the transaction
            "tags": ["tag_id_1", "tag_id_2"],               
            
            "timestamp": "timestamp",                                 
            # Time of the transaction (unix timestamp)
            
            # 0 if not deleted else 1
            "is_deleted": 0 / 1,                             
            
        }
"""

tag_db = deta.Base('ET_TagDB')  # access your DB
"""
    This is the main tag db
    Schema:
        {
            # Auto generated
            "key": "tag_id",                                
            
            # Route name to which this tag belongs to
            "route": "shlok",                               
            
            # Tag name
            "tag": "tag",                                   
            
            # 0 if not deleted else 1
            "is_deleted": 0 / 1,                             
        }
"""


def verify_password(route_name: str, password: str) -> bool:
    details = route_db.get(route_name)
    if details['is_protected'] and details['password'] != password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect Password")


# ------------------------------------------------------------------------------------------------------------------------------------------

route_router = APIRouter(
    tags=['Expense Tracker / Route'],
)


class LoginModel(BaseModel):
    route_name: str
    password: str

@route_router.post('/ep_tracker/login')
def checkRoute(
        data: LoginModel,
):
    details = route_db.get(data.route_name)
    # if not details:
    #     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Route not found")

    # Create a new route if not found
    if not details:
        route_db.insert({
            "key": data.route_name,
            "route": data.route_name,
            "is_protected": 0,
            "password": "",
        })
        return {"message": "Route created"}

    # Check if route is protected
    if not details['is_protected']:
        return {"message": "Route is not protected"}

    verify_password(data.route_name, data.password)

    return {
        "message": "Login Successful",
        "route": details['route'],
        "is_protected": details['is_protected']
    }



class ChangePassword(BaseModel):
    route_name: str
    is_protected: bool
    password: Optional[str]
    new_password: str

@route_router.post('/ep_tracker/change-password')
def changePassword(
    data: ChangePassword,
):
    details = route_db.get(data.route_name)
    if not details:
        route_db.insert({
            "key": data.route_name,
            "route": data.route_name,
            "is_protected": data.is_protected,
            "password": data.password,
        })

        return {"message": "Password Changed"}

    if details['is_protected'] and not details['password'] and data.password == "":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password cannot be empty")

    verify_password(data.route_name, data.password)

    route_db.update({
        "is_protected": data.is_protected,
        "password": data.new_password,
    }, data.route_name)
    return {"message": "Password Changed"}


# ------------------------------------------------------------------------------------------------------------------------------------------

transaction_router = APIRouter(
    tags=['Expense Tracker / Transaction'],
)


class TransactionModel(BaseModel):
    route_name: str
    password: str

    transaction_id: str
    title: str
    description: str
    amount: int
    tags: list
    timestamp: int

# Add a transaction
@transaction_router.post('/ep_tracker/add_transaction')
def addTransaction(
    data: TransactionModel,
):
    details = route_db.get(data.route_name)
    if not details:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Route not found")

    verify_password(data.route_name, data.password)

    # KEY is auto generated
    transaction_id = transaction_db.insert({
        "route": data.route_name,
        "title": data.title,
        "description": data.description,
        "amount": data.amount,
        "tags": data.tags,
        "timestamp": int(data.timestamp),
        "is_deleted": 0,
    })

    return {"message": "Transaction Added", "transaction_id": transaction_id}




# Edit a transaction
@transaction_router.post('/ep_tracker/edit_transaction')
def editTransaction(
    data: TransactionModel,
):
    verify_password(data.route_name, data.password)

    details = transaction_db.get(data.transaction_id)
    if not details:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")


    transaction_db.update({
        "title": data.title,
        "description": data.description,
        "amount": data.amount,
        "tags": data.tags,
        "timestamp": data.timestamp,
    }, data.transaction_id)

    return {"message": "Transaction Edited"}


# Delete a transaction
@transaction_router.get('/ep_tracker/delete_transaction')
def deleteTransaction(
        route_name: str,
        password: str,
        transaction_id: str,
):
    verify_password(route_name, password)
    # details = route_db.get(route_name)
    # if not details:
    #     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Route not found")

    try:
        transaction_db.update({
            "is_deleted": 1,
        }, transaction_id)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")

    return {"message": "Transaction Deleted"}


# Get all transactions for a route in a given timestamp range
@transaction_router.get('/ep_tracker/get_transactions')
def getTransactions(
        route_name: str,
        start_time: int,  # unix timestamp
        end_time: int,  # unix timestamp
):
    details = route_db.get(route_name)
    if not details:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Route not found")

    transactions = transaction_db.fetch({
        "route": route_name,
        # 'timestamp?gt': start_time,
        "timestamp?r": [start_time, end_time],
        "is_deleted": 0,
    })
    return {"transactions": transactions.items}


# ------------------------------------------------------------------------------------------------------------------------------------------


tag_router = APIRouter(
    tags=['Expense Tracker / Tag'],
)

class TagModel(BaseModel):
    route_name: str
    password: str

    tag_id: str
    tag: str

# Create a tag
@tag_router.post('/ep_tracker/create_tag')
def createTag(
    data: TagModel,
):
    verify_password(data.route_name, data.password)

    details = route_db.get(data.route_name)
    if not details:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Route not found")

    tag_id = tag_db.insert({
        "route": data.route_name,
        "tag": data.tag,
        "is_deleted": 0,
    })

    return {"message": "Tag Created", "tag_id": tag_id}


# Edit a tag
@tag_router.post('/ep_tracker/edit_tag')
def editTag(
    data: TagModel,
):
    verify_password(data.route_name, data.password)

    details = tag_db.get(data.tag_id)
    if not details:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tag not found")

    tag_db.update({
        "tag": data.tag,
    }, data.tag_id)

    return {"message": "Tag Edited"}


# Get all tags for a route
@tag_router.get('/ep_tracker/get_tags')
def getTags(
        route_name: str,
):
    tags = tag_db.fetch({
        "route": route_name,
    })
    return {"tags": tags.items}


# Delete a tag
@tag_router.get('/ep_tracker/delete_tag')
def deleteTag(
        tag_id: str,
):
    details = tag_db.get(tag_id)
    if not details:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tag not found")

    tag_db.update({
        "is_deleted": 1,
    }, tag_id)

    return {"message": "Tag Deleted"}