from flask import Flask, render_template
from flask_assets import Environment, Bundle

app = Flask(__name__, static_url_path='/static')
assets = Environment(app)
css = Bundle('style.css')
assets.register('css', css)

@app.route('/')
def landing():
    return render_template(static_folder='static', template_folder='templates',
                           template_name_or_list='landing.html')


if __name__ == "__main__":
    app.run()
