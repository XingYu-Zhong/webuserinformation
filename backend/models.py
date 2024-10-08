# models.py
import os
from sqlalchemy import Column, Integer, String, TIMESTAMP, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import pymysql

# 加载 .env 文件中的环境变量
load_dotenv()

# 安装 pymysql 替代 MySQLdb
pymysql.install_as_MySQLdb()

# 获取数据库连接配置信息
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

# 创建 SQLAlchemy 数据库连接 URL
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# 创建数据库引擎
engine = create_engine(DATABASE_URL, echo=True)

# 创建会话
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建基础类
Base = declarative_base()

# 定义数据库表模型
class BetaTester(Base):
    __tablename__ = "beta_testers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    phone = Column(String(50), nullable=True)
    remarks = Column(String(255), nullable=True)
    created_at = Column(TIMESTAMP, server_default='CURRENT_TIMESTAMP')

# 创建表（如果不存在则自动创建）
Base.metadata.create_all(bind=engine)