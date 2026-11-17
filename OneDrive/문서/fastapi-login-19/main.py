from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, Session
# pydantic은 리액트에서 데이터를 요청을 받을때 웹브라우저에서 적어서 클릭을 하게 되면 그 데이터가 우리한테 오겠죠 그 
# 데이터 타입이 맞는지 검사하는 라이브러리
from pydantic import BaseModel

DATABASE_URL = "postgresql://postgres.sjcqhzgjpoplxtqoqeyv:kWJUbef9Q0p74Aox@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"

# 객체로 만든거
engine = create_engine(DATABASE_URL)

# 객체로 만든거
Base = declarative_base()

# 테이블 모델(테이블 이름을 users)
class Profile(Base):
    # users가 테이블 이름이다 
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(120))
    provider = Column(String(50))

class EmailForm(BaseModel):
    username: str
    email: str
    provider : str

# 테이블이 없으면 생성
Base.metadata.create_all(bind=engine)

# 요청마다 세션을 열고, 끝나면 닫는 함수 finally는 성공해도 닫고 실패해도 닫는다?
def get_db():
    db = Session(bind=engine)
    try:
        yield db
    finally:
        db.close()

app = FastAPI()

@app.get("/")
def read_home():
    return {
        "hello": "world"
    }