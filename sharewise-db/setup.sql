DROP TABLE IF EXISTS appuser;
DROP TABLE IF EXISTS schoolprofile;
DROP TABLE IF EXISTS donorprofile;

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

CREATE TABLE schoolprofile (
    schoolprofile_id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL,
    school_name VARCHAR(255) NOT NULL,
    school_address VARCHAR(255) NOT NULL,
    PRIMARY KEY (schoolprofile_id),
    FOREIGN KEY (user_id) REFERENCES appuser(user_id) ON DELETE CASCADE 
    -- If the related user in appuser is deleted, the matching schoolprofile rows will be deleted automatically (ON DELETE CASCADE)
);

INSERT INTO schoolprofile (user_id, school_name, school_address) VALUES
(1, 'Greenwood High School', '123 Elm Street, Springfield'),
(2, 'Riverside Academy', '456 Oak Avenue, Rivertown'),
(3, 'Hilltop Public School', '789 Maple Drive, Hillview'),
(4, 'Sunrise Elementary', '321 Pine Road, Lakeside'),
(5, 'Brookfield High', '654 Cedar Lane, Brookfield'),
(6, 'Valley Crest School', '987 Birch Street, Valleytown'),
(7, 'Evergreen Academy', '147 Willow Way, Greendale'),
(8, 'Mountain Ridge School', '258 Aspen Blvd, Mountainview'),
(9, 'Oceanview Elementary', '369 Palm Street, Oceanview'),
(10, 'Westwood High School', '159 Spruce Circle, Westwood');

CREATE TABLE donorprofile (
    donorprofile_id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL,
    donor_name VARCHAR(255) NOT NULL,
    donor_address VARCHAR(255) NOT NULL,
    PRIMARY KEY (donorprofile_id),
    FOREIGN KEY (user_id) REFERENCES appuser(user_id) ON DELETE CASCADE
);
INSERT INTO donorprofile (user_id, donor_name, donor_address) VALUES
(1, 'Alice Smith', '123 Charity Street, Generosity City'),
(2, 'John Doe', '123 Charity Lane, Donor City'),
(3, 'Jane Smith', '456 Philanthropy Road, Kindness Town'),
(4, 'Robert Brown', '789 Generosity Street, Giving City'),
(5, 'Emily Davis', '321 Compassion Avenue, Heartfelt Town'),
(6, 'Michael Wilson', '654 Hope Boulevard, Support City'),
(7, 'Sarah Johnson', '987 Kindness Way, Benevolence Town'),
(8, 'David Lee', '147 Charity Circle, Altruism City'),
(9, 'Laura White', '258 Philanthropy Drive, Caring Town'),
(10, 'James Green', '369 Generosity Lane, Empathy City');

CREATE TABLE donation (
    donation_id INT GENERATED ALWAYS AS IDENTITY,
    donorprofile_id INT NOT NULL,
    schoolprofile_id INT NOT NULL,
    quantity INT NOT NULL,
    item_description VARCHAR(255) NOT NULL,
    PRIMARY KEY (donation_id),
    FOREIGN KEY (donorprofile_id) REFERENCES donorprofile(donorprofile_id) ON DELETE CASCADE,
    FOREIGN KEY (schoolprofile_id) REFERENCES schoolprofile(schoolprofile_id) ON DELETE CASCADE
);

INSERT INTO donation (donorprofile_id, schoolprofile_id, quantity, item_description) VALUES
(1, 1, 10, 'Good'),
(2, 2, 5, 'Used'),
(3, 3, 20, 'New'),
(4, 4, 15, 'Refurbished'),
(5, 5, 8, 'Damaged'),
(6, 6, 12, 'Old'),
(7, 7, 30, 'Old'),
(8, 8, 25, 'New'),
(9, 9, 18, 'Used'),
(10, 10, 22, 'Very Good');

CREATE TABLE request (
    request_id INT GENERATED ALWAYS AS IDENTITY,
    schoolprofile_id INT NOT NULL,
    donation_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    request_status VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (request_id),
    FOREIGN KEY (schoolprofile_id) REFERENCES schoolprofile(schoolprofile_id) ON DELETE CASCADE,
    FOREIGN KEY (donation_id) REFERENCES donation(donation_id) ON DELETE CASCADE
);

INSERT INTO request (schoolprofile_id, donation_id, item_name, request_status, quantity) VALUES
(1, 1, 'Monitors', 'Pending', 5),
(2, 2, 'Laptops', 'Approved', 3),
(3, 3, 'Stationery', 'Pending', 10),
(4, 4, 'Mouses', 'Pending', 7),
(5, 5, 'Headphones', 'Approved', 4),
(6, 6, 'Laptops', 'Approved', 2),
(7, 7, 'Printer', 'Pending', 1),
(8, 8, 'Tablets', 'Approved', 6),
(9, 9, 'Keyboards', 'Approved', 8),
(10, 10, 'Computers', 'Pending', 12);