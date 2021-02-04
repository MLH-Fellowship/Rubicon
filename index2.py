from flask import Flask, render_template, request
app = Flask(__name__)

@app.route("/layout2")
def greet():
    username = request.args.get('name')
    image_about= 'https://d23pdqum5wojjd.cloudfront.net/pullreminders-ogimage.jpg'
    browser_title = 'layout 2'
    main_title = "Github + Slack Integration"
    sub_title="About"
    paragraph = "In order to build the application, we need to use a Dockerfile. A Dockerfile is simply a text-based " \
                "script of instructions that is used to create a container image. If you’ve created Dockerfiles " \
                "before, you might see a few flaws in the Dockerfile below. But, don’t worry! We’ll go over them. "

    bullet_point=["Installing the Github integration for Slack", "Getting Started", "Need help?"]

    table_info={
        1:''
    }
    code = "RUN yarn install --production"

    return render_template(
        'index2.html',
        paragraph= paragraph,
        code= code,
        browser_title=browser_title,
        sub_title=sub_title,
        main_title=main_title,
        image_about=image_about,
        bullet_point=bullet_point
    )

if __name__ == "__main__":
    app.run()
