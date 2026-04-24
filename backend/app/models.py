from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.base import Base



class User(Base):
    __tablename__ = "Users"

    id_user = Column(Integer, primary_key=True)
    username = Column(String, nullable=False, unique=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

    tables = relationship("Table", back_populates="user")
    
class Table(Base):
    __tablename__ = "Tables"

    id_table = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    creation_at = Column(Date)

    id_user = Column(Integer, ForeignKey("Users.id_user"))

    user = relationship("User", back_populates="tables")
    columns = relationship("Column", back_populates="table")
    records = relationship("Record", back_populates="table")
    
    
class TableColumn(Base):
    __tablename__ = "Columns"

    column_id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    data_type = Column(String, nullable=False)

    id_table = Column(Integer, ForeignKey("Tables.id_table"))

    table = relationship("Table", back_populates="columns")
    values = relationship("Value", back_populates="column")
    

class Record(Base):
    __tablename__ = "Records"

    id_record = Column(Integer, primary_key=True,)
    creation_at = Column(Date)

    id_table = Column(Integer, ForeignKey("Tables.id_table"))

    table = relationship("Table", back_populates="records")
    values = relationship("Value", back_populates="record")


class Value(Base):
    __tablename__ = "Values"

    id_value = Column(Integer, primary_key=True)
    value = Column(String)

    id_record = Column(Integer, ForeignKey("Records.id_record"))
    id_column = Column(Integer, ForeignKey("Columns.column_id"))

    record = relationship("Record", back_populates="values")
    column = relationship("TableColumn", back_populates="values")
