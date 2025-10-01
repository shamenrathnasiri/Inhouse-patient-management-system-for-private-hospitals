import mysql.connector

# Connect to MySQL server (without specifying database)
connection = mysql.connector.connect(
    host='localhost',
    user='root',
    password=''  # Replace with your MySQL root password
)

cursor = connection.cursor()

# Create database
cursor.execute("CREATE DATABASE IF NOT EXISTS hospital_db")
print("Database 'hospital_db' created successfully!")

cursor.close()
connection.close()