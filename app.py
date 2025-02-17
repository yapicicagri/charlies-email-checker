from flask import Flask, flash, redirect, render_template, request

# Configure application
app = Flask(__name__)

# main route
@app.route("/", methods=["GET", "POST"])
def index():
    result = ""
    if request.method == "POST":
        result = "Hello, world!"
    
    return render_template("index.html", result=result)

if __name__ == "__main__":
    app.run(debug=True)