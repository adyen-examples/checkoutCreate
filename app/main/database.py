import sqlite3
import json

# location of SQLite database file
_path_to_db_file = None


# function to set path to database file
def set_path_to_db_file(path_to_db_file):
    global _path_to_db_file
    _path_to_db_file = path_to_db_file

# function to execute an SQL statement
def _execute_sql(sql, read):
    with sqlite3.connect(_path_to_db_file) as conn:
        cursor = conn.cursor()
        cursor.execute(sql)
        if read == 'true':
            output = cursor.fetchall()
            # print(output)
            return output
        cursor.close()

# function to create database table
def create_tables():
    sql_create_style = """CREATE TABLE styles(saveId PRIMARY KEY, value NOT NULL, age INTEGER);"""
    _execute_sql(sql_create_style, False)
    sql_create_config = """CREATE TABLE config(saveId PRIMARY KEY, value NOT NULL, age INTEGER);"""
    _execute_sql(sql_create_config, False)
    print("created tables")


# function to insert a user into the database table
def insert_variables(saveId, value):
    # print("Printing saveId ", saveId)
    sql_insert_variables = "INSERT INTO styles VALUES ('" + saveId + "', '" + value + "', datetime('now'));"
    _execute_sql(sql_insert_variables, False)
    result = {'saveId': saveId}
    return result

def insert_config(saveId, value):
    sql_insert_config = "INSERT INTO config VALUES ('" + saveId + "', '" + value + "', datetime('now'));"
    _execute_sql(sql_insert_config, False)
    result = {'saveId': saveId}
    return result

# function to get stored variables
def get_variables(saveId):
    sql_get_variables = "SELECT * FROM styles"
    read = 'true'
    listData = _execute_sql(sql_get_variables, read)
    storedIDs = [item[0] for item in listData]
    # print(storedIDs)
    storedValues = [item[1] for item in listData]
    # print(storedValues)
    saveId = saveId
    if saveId in storedIDs:
        index = storedIDs.index(saveId)
        checkValue = storedValues[index]
        return checkValue
    else:
        return '{"error": "no user"}'

# function to get stored config
def get_config(saveId):
    sql_get_config = "SELECT * FROM config"
    read = 'true'
    listData = _execute_sql(sql_get_config, read)
    storedIDs = [item[0] for item in listData]
    print(storedIDs)
    storedValues = [item[1] for item in listData]
    print(storedValues)
    saveId = saveId
    if saveId in storedIDs:
        index = storedIDs.index(saveId)
        checkValue = storedValues[index]
        return checkValue
    else:
        return '{"error": "no user"}'


# function to delete old data after a set amount of time
def delete_old_data():
    sql_delete_vars = """DELETE FROM styles WHERE (age <= datetime('now', '-120 days') AND saveId != '3bd70a17-ec52-43e5-baa7-d1ae756efbac')"""
    sql_get_remaining = "SELECT * FROM styles"
    try:
        conn = sqlite3.connect(_path_to_db_file)
        cursor = conn.cursor()
        print("Connected to SQLite")
        cursor.execute(sql_get_remaining)
        current = cursor.fetchall()
        allIDs = [item[0] for item in current]
        ages = [item[2] for item in current]
        print("These are the initial IDs in DB", allIDs)
        print("These are the ages", ages)
        cursor.execute(sql_delete_vars)
        conn.commit()
        print('deleted')
        cursor.execute(sql_get_remaining)
        variables = cursor.fetchall()
        storedIDs = [item[0] for item in variables]
        print("These are the reamining IDs in DB", storedIDs)
        print(variables)
        cursor.close()
        return 'deleted'
    except sqlite3.Error as error:
        print("Failed to read data from sqlite table", error)
    finally:
        if conn:
            conn.close()
            print("The SQLite connection is closed")

def temp_delete_table():
    sql_delete_table = """DROP TABLE styles"""
    try:
        conn = sqlite3.connect(_path_to_db_file)
        cursor = conn.cursor()
        print("Connected to SQLite")
        cursor.execute(sql_delete_table)
        cursor.close()
        return 'deleted'
    except sqlite3.Error as error:
        print("Failed to read data from sqlite table", error)
    finally:
        if conn:
            conn.close()
            print("The SQLite connection is closed")




