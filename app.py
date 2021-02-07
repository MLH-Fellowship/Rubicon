#!/usr/bin/env python3

from flask import Flask, render_template, request
app = Flask(__name__)

@app.route("/greet")
def greet():
    module_name = request.args.get('module_name')
    paragraph = request.args.get('paragraph')
    code = request.args.get('code')

    return render_template('index.html', module_name=module_name, paragraph= paragraph, code= code)

if __name__ == "__main__":
    app.run()


