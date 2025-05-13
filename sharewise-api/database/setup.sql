DROP TABLE IF EXISTS donation;
DROP TABLE IF EXISTS request;
DROP TABLE IF EXISTS donor;
DROP TABLE IF EXISTS school;


CREATE TABLE school (
    school_id INT GENERATED ALWAYS AS IDENTITY,
    school_name VARCHAR(255) NOT NULL,
    school_address VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (school_id)
);
INSERT INTO school (school_name, school_address, email, password) VALUES
('Green Valley High School', '123 Elm Street, Springfield', 'contact@greenvalley.edu', '5f4dcc3b5aa765d61d8327deb882cf99'),
('Riverside Academy', '456 Oak Avenue, Rivertown', 'admin@riverside.org', '6cb75f652a9b52798eb6cf2201057c73'),
('Hilltop Elementary', '789 Maple Drive, Hillview', 'info@hilltop.edu', 'b2e98ad6f6eb8508dd6a14cfa704bad7'),
('Sunrise Public School', '321 Pine Road, Lakeside', 'sunrise@schools.net', 'e99a18c428cb38d5f260853678922e03'),
('Brookfield School', '654 Cedar Lane, Brookfield', 'office@brookfield.edu', '25d55ad283aa400af464c76d713c07ad'),
('Valley Crest Academy', '987 Birch Street, Valleytown', 'valleycrest@edu.org', '7c6a180b36896a0a8c02787eeafb0e4c'),
('Evergreen Elementary', '147 Willow Way, Greendale', 'hello@evergreenschool.org', '5ebe2294ecd0e0f08eab7690d2a6ee69'),
('Mountain Ridge High', '258 Aspen Blvd, Mountainview', 'contact@mountainridge.com', '8d3533d75ae2c3966d7e0d4fcc69216b'),
('Oceanview School', '369 Palm Street, Oceanview', 'oceanview@schools.org', 'd8578edf8458ce06fbc5bb76a58c5ca4'),
('Westwood High', '159 Spruce Circle, Westwood', 'admin@westwoodhigh.edu', '6c569aabbf7775ef8fc570e228c16b98');

CREATE TABLE request (
    request_id INT GENERATED ALWAYS AS IDENTITY,
    school_id INT,
    item_name VARCHAR(255) NOT NULL,
    request_status VARCHAR(50) DEFAULT 'Pending',
    quantity INT DEFAULT 0,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (request_id),
    FOREIGN KEY (school_id) REFERENCES school(school_id) ON DELETE CASCADE
);

INSERT INTO request (school_id, item_name, request_status, quantity) VALUES
(1, 'Monitors', 'Pending', 5),
(2, 'Laptops', 'Approved', 3),
(3, 'Stationery', 'Pending', 10),
(4, 'Mouses', 'Pending', 7),
(5, 'Headphones', 'Approved', 4),
(6, 'Laptops', 'Approved', 2),
(7, 'Printer', 'Pending', 1),
(8, 'Tablets', 'Approved', 6),
(9, 'Keyboards', 'Approved', 8),
(10, 'Computers', 'Pending', 12);


CREATE TABLE donor (
    donor_id INT GENERATED ALWAYS AS IDENTITY,
    donor_name VARCHAR(255) NOT NULL,
    donor_address VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (donor_id)
);
INSERT INTO donor (donor_name, donor_address, email, password) VALUES
('Hope Foundation', '10 Charity Lane, Springfield', 'info@hopefoundation.org', '5f4dcc3b5aa765d61d8327deb882cf99'),
('Bright Future Org', '25 Beacon Street, Lakeside', 'contact@brightfuture.org', '6cb75f652a9b52798eb6cf2201057c73'),
('Helping Hands', '88 Elmwood Ave, Rivertown', 'support@helpinghands.net', 'b2e98ad6f6eb8508dd6a14cfa704bad7'),
('KindHeart Donors', '12 Pine Crescent, Hillview', 'admin@kindheart.org', 'e99a18c428cb38d5f260853678922e03'),
('GiveMore Trust', '45 Willow Way, Brookfield', 'hello@givemore.org', '25d55ad283aa400af464c76d713c07ad'),
('Unity Relief', '30 Maple Blvd, Valleytown', 'contact@unityrelief.net', '7c6a180b36896a0a8c02787eeafb0e4c'),
('Care & Share', '17 Birch Street, Greendale', 'info@careshare.org', '5ebe2294ecd0e0f08eab7690d2a6ee69'),
('Generous Souls', '93 Cedar Lane, Oceanview', 'team@gensouls.com', '8d3533d75ae2c3966d7e0d4fcc69216b'),
('Sunlight Aid', '61 Aspen Circle, Sunville', 'sunlight@aid.org', 'd8578edf8458ce06fbc5bb76a58c5ca4'),
('BetterWorld Initiative', '42 Palm Road, Westwood', 'hello@betterworld.org', '6c569aabbf7775ef8fc570e228c16b98');

CREATE TABLE donation (
    donation_id INT GENERATED ALWAYS AS IDENTITY,
    donor_id INT NOT NULL,
    request_id INT NOT NULL,
    quantity INT NOT NULL,
    item_description VARCHAR(255) NOT NULL,
    PRIMARY KEY (donation_id),
    FOREIGN KEY (donor_id) REFERENCES donor(donor_id) ON DELETE CASCADE,
    FOREIGN KEY (request_id) REFERENCES request(request_id) ON DELETE CASCADE
);

INSERT INTO donation (donor_id, request_id, quantity, item_description) VALUES
(1, 1, 100, 'new'),
(2, 2, 50, 'used'),
(3, 3, 200, 'good'),
(4, 4, 80, 'new'),
(5, 5, 120, 'used'),
(1, 2, 30, 'good'),
(2, 3, 60, 'new'),
(3, 1, 40, 'used'),
(4, 5, 25, 'good'),
(5, 4, 90, 'new');