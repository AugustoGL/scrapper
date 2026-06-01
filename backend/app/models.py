from xxlimited_35 import Null

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Boolean
from sqlalchemy.orm import relationship
from app.core.base import Base
from app.schema.table import ProcessingStatus



class User(Base):
    __tablename__ = "Users"

    id_user = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    reset_token = Column(String, nullable=True, default=None)
    is_verified = Column(Boolean, default=False, nullable=False)

    tables = relationship("Table", back_populates="user", cascade='all, delete')
    
    def __str__(self):
        return f"User: {self.id_user}, {self.username}, {self.email}, {self.password}"

  
class Table(Base):
    __tablename__ = "Tables"

    id_table = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime)

    id_user = Column(Integer, ForeignKey("Users.id_user"))

    user = relationship("User", back_populates="tables")
    processings = relationship("Processing", back_populates="table", cascade='all, delete')
    columns = relationship("TableColumn", back_populates="table", cascade='all, delete')
    records = relationship("Record", back_populates="table", cascade='all, delete')
    
    
class TableColumn(Base):
    __tablename__ = "TableColumns"

    id_column = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    data_type = Column(String, nullable=False)
    description = Column(String, nullable=False)

    id_table = Column(Integer, ForeignKey("Tables.id_table"))

    table = relationship("Table", back_populates="columns")
    values = relationship("Value", back_populates="column", cascade='all, delete')
    

class Record(Base):
    __tablename__ = "Records"

    id_record = Column(Integer, primary_key=True,)
    created_at = Column(DateTime)
    id_table = Column(Integer, ForeignKey("Tables.id_table"))
    id_processing = Column(Integer, ForeignKey("Processing.id_processing"))

    table = relationship("Table", back_populates="records")
    processing = relationship("Processing", back_populates="records")
    values = relationship("Value", back_populates="record", cascade='all, delete')


class Value(Base):
    __tablename__ = "Values"

    id_value = Column(Integer, primary_key=True)
    value = Column(String)

    id_record = Column(Integer, ForeignKey("Records.id_record"))
    id_column = Column(Integer, ForeignKey("TableColumns.id_column"))

    record = relationship("Record", back_populates="values")
    column = relationship("TableColumn", back_populates="values")


class Processing(Base):
    __tablename__ = "Processing"
    
    id_processing = Column(Integer, primary_key=True)
    status = Column(Enum(ProcessingStatus), nullable=False)
    created_at = Column(DateTime)
    started_at = Column(DateTime, nullable=True)
    finished_at = Column(DateTime, nullable=True)
    error_message: str | None = Column(String, nullable=True)
    error_detail: str | None = Column(String, nullable=True) 
    id_table = Column(Integer, ForeignKey("Tables.id_table"))
    
    table = relationship("Table", back_populates="processings")
    records = relationship("Record", back_populates="processing", cascade='all, delete')
