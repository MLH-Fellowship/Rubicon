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
    paragraph2= "When you install the new GitHub integration for Slack in your Slack workspace, you'll be prompted to move over all of your existing subscriptions - so getting set up again is easy. As you enable individual subscriptions in the new app, your settings will be automatically migrated and subscriptions in the legacy app will be disabled."

    #table and table list should be all stored in a dictionary in the future
    table_title = ['Event', 'Is Filtered']
    # table_list = {
    #     'Pull':'✅ Yes',
    #     'Deployment': '❌ No',
    # }

    code = "RUN yarn install --production"

    return render_template(
        'index2.html',
        paragraph= paragraph,
        code= code,
        browser_title=browser_title,
        sub_title=sub_title,
        main_title=main_title,
        image_about=image_about,
        bullet_point=bullet_point,
        table_title=table_title,
        paragraph2=paragraph2
    )

if __name__ == "__main__":
    app.run()
