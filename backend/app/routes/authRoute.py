from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.router.dependencies import get_db
from app.core.security import create_access_token, verify_password, get_password_hash
from app.models.usersModel import User
from app.schemas.userSchema import UserCreate, UserLogin, UserResponse

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user_in.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Hash the password before saving
    new_user = User(
        name=user_in.name,
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login")
def login(
    user_in: UserLogin,  # Accepts raw JSON body: {"email": "...", "password": "..."}
    db: Session = Depends(get_db),
):
    # 1. Fetch user by email
    user = db.query(User).filter(User.email == user_in.email).first()

    # 2. Validate user existence and password hash
    if not user or not verify_password(user_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Generate access token
    access_token = create_access_token(subject=str(user.id))
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }