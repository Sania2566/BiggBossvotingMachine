from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import timedelta

app = Flask(__name__)
app.secret_key = 'biggboss_secret_key'
app.permanent_session_lifetime = timedelta(days=7)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///biggboss.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150))
    name = db.Column(db.String(150))
    mobile = db.Column(db.String(20))
    voted_for = db.Column(db.Integer)

class Vote(db.Model):
    contestant_id = db.Column(db.Integer, primary_key=True)
    count = db.Column(db.Integer, default=0)

@app.route('/')
def welcome():
    return render_template('welcome.html')

@app.route('/privacy')
def privacy():
    return render_template('privacy.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
        name = request.form['name']
        mobile = request.form['mobile']

        if User.query.filter_by(username=username).first():
            flash('Username already exists. Please login.', 'error')
            return redirect(url_for('login'))

        new_user = User(username=username, password=password, email=email, name=name, mobile=mobile)
        db.session.add(new_user)

        # Reset all votes (optional: only if no votes exist)
        if Vote.query.count() == 0:
            for i in range(1, 17):
                db.session.add(Vote(contestant_id=i, count=0))

        db.session.commit()
        flash('Signup successful! Please log in.', 'success')
        return redirect(url_for('login'))

    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # 🔒 Admin login shortcut
        if username == 'admin123' and password == 'letmein123':
            session.permanent = True
            session['username'] = username
            session['user_id'] = 0  # Admin doesn't need DB user ID
            session['is_admin'] = True
            flash('Welcome Admin!', 'info')
            return redirect(url_for('vote_count'))

        user = User.query.filter_by(username=username).first()

        if user and user.password == password:
            session.permanent = True
            session['username'] = username
            session['user_id'] = user.id
            session['is_admin'] = False
            flash(f"Welcome back, {user.name}!", 'info')
            return redirect(url_for('timer'))
        else:
            flash('Invalid credentials or account not found. Please sign up.', 'error')
            return redirect(url_for('signup'))

    return render_template('login.html')

@app.route('/timer')
def timer():
    if 'username' not in session:
        flash('Please log in first.', 'error')
        return redirect(url_for('login'))
    return render_template('timer.html')

@app.route('/second')
def second():
    if 'username' not in session:
        flash('Please login first.', 'error')
        return redirect(url_for('login'))

    # If admin is logged in, just show vote counts without user details
    if session.get('is_admin'):
        votes = {v.contestant_id: v.count for v in Vote.query.all()}
        return render_template('second.html', voted_for=None, vote_counts=votes, user_name='Admin')

    # Regular user logic
    user = User.query.filter_by(username=session['username']).first()
    if not user:
        flash('User not found.', 'error')
        return redirect(url_for('login'))

    votes = {v.contestant_id: v.count for v in Vote.query.all()}
    return render_template('second.html', voted_for=user.voted_for, vote_counts=votes, user_name=user.name)


@app.route('/vote_count')
def vote_count():
    if 'username' in session and session.get('is_admin'):
        contestants = {
            1: "Siddharth Shukla",
            2: "Rashmi Desai",
            3: "Shehnaaz Kaur Gill",
            4: "Devoleena Bhatachaarjee",
            5: "Asim Riaz",
            6: "Paras Chhabra",
            7: "Arti Singh",
            8: "Mahira Sharma",
            9: "Shefali Bagga",
            10: "Koena Mitra",
            11: "Abu Malik",
            12: "Daljeet Kaur",
            13: "Siddharth Dey",
            14: "Arhaan Khan",
            15: "Vikas Gupta",
            16: "Umar Khan"
        }

        vote_counts = {vote.contestant_id: vote.count for vote in Vote.query.all()}
        return render_template('vote_count.html', vote_counts=vote_counts, contestant_names=contestants)
    else:
        flash("Unauthorized access", "error")
        return redirect(url_for('second'))



@app.route('/forgot')
def forgot():
    return render_template('forgot.html')

@app.route('/vote', methods=['POST'])
def vote():
    if 'username' not in session:
        return jsonify({'status': 'error', 'message': 'Login required'}), 401

    username = session['username']

    # Prevent admin from voting
    if username == 'admin123':
        return jsonify({'status': 'error', 'message': 'Admin cannot vote'}), 403

    user = User.query.filter_by(username=username).first()
    if user is None:
        return jsonify({'status': 'error', 'message': 'User not found'}), 404

    if user.voted_for is not None:
        return jsonify({'status': 'error', 'message': 'Already voted'}), 403

    data = request.get_json(force=True)
    contestant_id = data.get('contestantId')

    if contestant_id is None or not (1 <= contestant_id <= 16):
        return jsonify({'status': 'error', 'message': 'Invalid contestant ID'}), 400

    vote = Vote.query.filter_by(contestant_id=contestant_id).first()
    if vote:
        vote.count += 1
        user.voted_for = contestant_id
        db.session.commit()

        votes = {v.contestant_id: v.count for v in Vote.query.all()}
        return jsonify({'status': 'success', 'message': 'Vote counted', 'vote_counts': votes})

    return jsonify({'status': 'error', 'message': 'Contestant not found'}), 404



@app.route('/index')
def index():
    if 'username' not in session:
        flash('Please login first.', 'error')
        return redirect(url_for('login'))

    user = User.query.filter_by(username=session['username']).first()
    return render_template('index.html', user=user)


@app.route('/logout')
def logout():
    session.pop('username', None)
    flash('You have been logged out.', 'info')
    return redirect(url_for('login'))


@app.route('/description')
def description():
    return render_template('description.html')

@app.route('/highlight')
def highlight():
    return render_template('highlight.html')

@app.route('/tutorial')
def tutorial():
    return render_template('tutorial.html')

# ✅ Final Fix — create tables on startup
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # ✅ Create tables if they don't exist
    app.run(debug=True)
