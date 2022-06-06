-- @BLOCK
CREATE TABLE Category(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE
);

-- @BLOCK
DESCRIBE Category;


-- @BLOCK
CREATE TABLE Subcategory(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE
);

-- @BLOCK
DESCRIBE Subcategory;

-- @BLOCK
SELECT * FROM Subcategory;

-- @BLOCK
CREATE TABLE CategorySubcategoryRelation(
  CategoryID INT NOT NULL,
  SubcategoryID INT NOT NULL,
  FOREIGN KEY (CategoryID) REFERENCES Category(id),
  FOREIGN KEY (SubcategoryID) REFERENCES Subcategory(id),
  UNIQUE (CategoryID, SubcategoryID)
);

-- @BLOCK
DESCRIBE CategorySubcategoryRelation;

-- @BLOCK
INSERT INTO Category(name)
VALUES ("clothes & apparel");

-- @BLOCK
SELECT * from Category;

-- @BLOCK
INSERT INTO Subcategory(name, category_id)
VALUES ("tops", 1);

-- @BLOCK
SELECT * from Subcategory;

-- @BLOCK
INSERT INTO Attribute(name)
VALUES ("color");

-- @BLOCK
SELECT * from Attribute;

-- @BLOCK
INSERT INTO attribute_option(name, attribute_id)
VALUES ("blue", 1)

-- @BLOCK
SELECT * from attribute_option;

-- @BLOCK
INSERT INTO subc_attr_relation(subcategory_id, attribute_id)
VALUES (1, 1);

-- @BLOCK
SELECT * from subc_attr_relation;
