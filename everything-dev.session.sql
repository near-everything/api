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
VALUES ("testCategory");

-- @BLOCK
SELECT * from Category;

-- @BLOCK
INSERT INTO Subcategory(name)
VALUES ("testSubcategory");

-- @BLOCK
SELECT * from Subcategory;

-- @BLOCK
INSERT INTO CategorySubcategoryRelation(CategoryID, SubcategoryID)
VALUES ("1", "1");

-- @BLOCK
SELECT * from CategorySubcategoryRelation
INNER JOIN Category;