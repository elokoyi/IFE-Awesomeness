import os
from app import app
from flask import render_template, request, redirect, url_for

app.secret_key = b'\xb1\xe2\x9fs1I\x80\x7f\xd1\xd6 \xf3\xear\xfb\x06'

from flask_pymongo import PyMongo

# name of database
app.config['MONGO_DBNAME'] = 'connect' 

# URI of database
app.config['MONGO_URI'] = 'mongodb+srv://connectuser:TTOoMBxlK16XpKtJ@cluster0-gbcn0.mongodb.net/connect?retryWrites=true&w=majority' 
mongo = PyMongo(app)


# INDEX

@app.route('/')
@app.route('/index')

def index():
    return render_template('index.html')

@app.route('/no-sidebar.html', methods = ["GET", "POST"])
def nosidebar():
    return render_template("no-sidebar.html")
    

@app.route('/right-sidebar.html', methods = ["GET", "POST"])
def rightsidebar():
    return render_template("right-sidebar.html")

@app.route('/left-sidebar.html', methods = ["GET", "POST"])
def lefttsidebar():
    return render_template("left-sidebar.html")
    

@app.route('/mission.html', methods = ["GET", "POST"])
def mission():
    return render_template("mission.html")
    

@app.route('/signup.html', methods = ["GET", "POST"])
def signuppage():
    return render_template("signup.html")

@app.route('/home.html', methods = ["GET", "POST"])
def home(): 
    return render_template("home.html")
    
@app.route('/index-new.html', methods = ["GET", "POST"])
def info():
    users = mongo.db.users
    return render_template("index-new.html")


# SIGN-UP:
@app.route('/signup', methods=['GET','POST'])
def signup():
    if request.method =="POST":
        # take in the info they gave us, check if username is taken, if username is available put into a database of user
        users = mongo.db.users
        existing_user = users.find_one({"username":request.form['username']})
        if existing_user is None:
            users.insert({"username":request.form['username'],"password":request.form['password'],"email":request.form['email'],"name":request.form['name']})
            return render_template("index-new.html")
        else:
            return render_template("/useduser.html")
    else:
        return redirect("/index")
        

#Log In:
@app.route('/login', methods=['POST'])
def login():
    users = mongo.db.users
    # use the username to find the account
    existing_user = users.find_one({"username":request.form['username']})
    if existing_user:
        # check if the password is right
        if existing_user['password'] == request.form['password'] :
            # session['username'] = request.form['username']
            return render_template("index-new.html", existing_user = existing_user)
        else:
            return "Your password doesn't match your username."
    else:
        return "There is no user with that username. Try making an account."
  
#   LOG OUT
@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')



