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
            print(output)
            return output
        cursor.close()

# function to create database table
def create_table():
    sql_create_table = """CREATE TABLE styles(saveId PRIMARY KEY, value NOT NULL);"""
    _execute_sql(sql_create_table, False)


# function to insert a user into the database table
def insert_variables(saveId, value):
    print("Printing saveId ", saveId)
    sql_insert_variables = "INSERT INTO styles VALUES ('" + saveId + "', '" + value + "');"
    _execute_sql(sql_insert_variables, False)
    result = {'saveId': saveId}
    return result

# function to validate login details and retrieve lemId
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
        return 'user error'


# function to validate login details and retrieve lemId
def get_variables1(saveId):
    sql_get_vars = """SELECT value FROM variables WHERE saveId = ?"""
    try:
        conn = sqlite3.connect(_path_to_db_file)
        cursor = conn.cursor()
        print("Connected to SQLite")
        cursor.execute(sql_get_vars, (saveId,))
        variables = cursor.fetchall()
        print("Printing saveId ", lem_id)
        print(variables)
        storesList = []
        allStores = []
        for variablesArray in variables:
            store = storeArray[0]
            result = get_stores_for_le(store)
            storesList.append(result)
            print("StoreID:\n"+ store)
            print(result)
            storeResult = json.loads(result)
            storeName = storeResult['reference']
            storeStatus = storeResult['status']
            storeObj = {"storeName": storeName, "storeId":store, "status":storeStatus}
            print(storeResult['reference'])
            allStores.append(storeObj)
            print(allStores)
        cursor.close()
        return allStores
    except sqlite3.Error as error:
        print("Failed to read data from sqlite table", error)
    finally:
        if conn:
            conn.close()
            print("The SQLite connection is closed")


