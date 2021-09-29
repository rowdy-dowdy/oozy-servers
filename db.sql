CREATE DATABASE project1;
use project1;


-- user

create table user (
  user_id int(11) primary key not null auto_increment,
  username varchar(50) UNIQUE not null,
	password varchar(100) not null,
	email varchar(255) unique not null,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

insert into user (username,password,email)
values
	('admin01',
	'$argon2i$v=19$m=4096,t=3,p=1$s7kOawjvt3ZZovAzbqcoCA$MrDsHczfKC2sc2ttv+iX1QVgzsj+lZzNJdpiP7mTbbo',
	'admin01@gmail.com'),
	('user01',
	'$argon2i$v=19$m=4096,t=3,p=1$w1GijUk0CF2OPP93scYlVg$XgyBpOXfC2pXSkWUe5MzXGJ03rGe+CVkhgfAiTIiAxo',
	'user01@gmail.com');


-- admin01 Admin123
-- user01 User12345


-- roles

create table roles (
	role_id int(11) primary key not null auto_increment,
	role_name varchar(255) unique not null
);

insert into roles (role_name)
values
	('admin'),
	('customer');


-- user roles

create table user_roles (
	user_id INT NOT NULL,
  role_id INT NOT NULL,
  grant_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (role_id) REFERENCES roles (role_id),
  FOREIGN KEY (user_id) REFERENCES user (user_id)
);

insert into user_roles (user_id,role_id)
values
	(1,1),
	(2,2);


-- parent category

create table parent_category (
	parent_category_id smallint primary key not null auto_increment,
	name varchar(50) not null,
	description text
);

insert into parent_category(name, description)
values
	('Women', ''),
	('Men', ''),
	('Kids', '');


-- product_category

create table product_category (
	product_category_id smallint primary key not null auto_increment,
	parent_category_id smallint,
	name varchar(50) not null,
	description text,
	foreign key (parent_category_id) references parent_category (parent_category_id)
);

insert into product_category(parent_category_id, name, description)
values
	(1, 'Shoes',''),
	(1, 'Dresses',''),
	(1, 'Tops',''),
	(1, 'Bags',''),
	(1, 'Skirts',''),
	(1, 'Denim',''),
	(1, 'Jeans',''),
	(1, 'Leggings',''),
	(2, 'Blouses',''),
	(2, 'Coats',''),
	(2, 'Jackets',''),
	(2, 'Hoodies',''),
	(2, 'Skirts',''),
	(2, 'Hats',''),
	(2, 'Jeans',''),
	(2, 'Shoes',''),
	(3, 'Shoes',''),
	(3, 'Dresses',''),
	(3, 'Tops','');


-- product 

create table product (
	product_id int primary key not null auto_increment,
	name varchar(255) not null,
	product_category_id smallint not null,
	img varchar(255) not null,
	price decimal not null,
	discount decimal default 0,
	description text,
	colors json,
	sizes json,
	other_version json,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	foreign key (product_category_id) references product_category (product_category_id)
);

-- insert into product (name, product_category_id, img, price, discount, description, colors, sizes, other_version)
-- values
-- 	('Leather Sneakers',1,'/src/product-5.jpg',115.00,0,'','[1,2,3]','[1,2,3]', '{}');


-- cart

create table cart (
	cart_id int primary key not null auto_increment,
	user_id INT not null unique,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	foreign key (user_id) references user (user_id)
);


-- cart item

create table cart_item (
	cart_item_id int primary key not null auto_increment,
	product_id int not null,
	card_id int not null,
	quantity TINYINT not null default 1,
	active boolean not null default false,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	constraint stock_nonnegative check (quantity > 0),
	foreign key (card_id) references cart (cart_id)
);