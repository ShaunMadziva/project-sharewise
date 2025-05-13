DROP TABLE IF EXISTS appuser;

CREATE TABLE appuser (
    user_id INT GENERATED ALWAYS AS IDENTITY,
    profile_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id)
);

INSERT INTO appuser (profile_name, email, password_hash, user_type) VALUES
('Alice Smith', 'alice.smith@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'school'),
('Bob Johnson', 'bob.johnson@example.com', 'e99a18c428cb38d5f260853678922e03', 'donor'),
('Charlie Lee', 'charlie.lee@example.com', '25d55ad283aa400af464c76d713c07ad', 'donor'),
('Diana Ray', 'diana.ray@example.com', 'd8578edf8458ce06fbc5bb76a58c5ca4', 'school'),
('Ethan Cole', 'ethan.cole@example.com', '5ebe2294ecd0e0f08eab7690d2a6ee69', 'donor'),
('Fiona Hart', 'fiona.hart@example.com', '21232f297a57a5a743894a0e4a801fc3', 'school'),
('George Hill', 'george.hill@example.com', '098f6bcd4621d373cade4e832627b4f6', 'donor'),
('Hannah Kim', 'hannah.kim@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'donor'),
('Ian Snow', 'ian.snow@example.com', '202cb962ac59075b964b07152d234b70', 'school'),
('Julia West', 'julia.west@example.com', '81dc9bdb52d04dc20036dbd8313ed055', 'school');
