#!/usr/bin/env python3

from flask import Flask, render_template, request
app = Flask(__name__)

@app.route("/greet")
def greet():
    username = request.args.get('name')
    module_name = "Building the App’s Container Image"
    paragraph = "In order to build the application, we need to use a Dockerfile. A Dockerfile is simply a text-based " \
                "script of instructions that is used to create a container image. If you’ve created Dockerfiles " \
                "before, you might see a few flaws in the Dockerfile below. But, don’t worry! We’ll go over them. "

    code = "RUN yarn install --production"

    return render_template('index.html', module_name=module_name, paragraph= paragraph, code= code)

if __name__ == "__main__":
    app.run()


