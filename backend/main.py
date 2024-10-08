# main.py
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from models import SessionLocal, BetaTester  # 从 models.py 中导入 SessionLocal 和模型
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 配置 CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源的请求。可以将 "*" 替换为指定的前端地址，如 ["http://localhost:3000", "http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有 HTTP 方法，如 "GET", "POST", "PUT", "DELETE"
    allow_headers=["*"],  # 允许所有 HTTP 头
)


# 创建数据库会话的依赖
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 创建请求体模型
class BetaTesterCreate(BaseModel):
    email: str
    phone: str = None
    remarks: str = None

# 创建新的 Beta 测试者
@app.post("/beta_testers/")
def create_beta_tester(beta_tester: BetaTesterCreate, db: Session = Depends(get_db)):
    # 检查 email 是否已存在
    db_tester = db.query(BetaTester).filter(BetaTester.email == beta_tester.email).first()
    if db_tester:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # 创建新的 BetaTester 实例
    new_tester = BetaTester(email=beta_tester.email, phone=beta_tester.phone, remarks=beta_tester.remarks)
    db.add(new_tester)
    db.commit()
    db.refresh(new_tester)  # 获取新插入的记录的完整信息
    return {"message": "Tester created successfully", "tester": new_tester}

# 获取所有 Beta 测试者信息
@app.get("/beta_testers/")
def get_all_beta_testers(db: Session = Depends(get_db)):
    testers = db.query(BetaTester).all()
    return {"testers": testers}

# 根据 email 获取特定 Beta 测试者信息
@app.get("/beta_testers/{email}")
def get_beta_tester(email: str, db: Session = Depends(get_db)):
    tester = db.query(BetaTester).filter(BetaTester.email == email).first()
    if not tester:
        raise HTTPException(status_code=404, detail="Tester not found")
    return {"tester": tester}

# 创建 main 函数来启动应用
def main():
    # 使用 uvicorn 启动 FastAPI 应用，指定主机地址和端口
    uvicorn.run("main:app", host="127.0.0.1", port=18009, reload=True)

# 检查是否是主程序入口
if __name__ == "__main__":
    main()