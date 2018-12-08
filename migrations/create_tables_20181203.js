const dbconfig = require('../dbconfig');
var mysql = require('mysql');

function runMigration() {
	var connection = mysql.createConnection(dbconfig);
	connection.connect();

	CREATE TABLE `movie` (
	  `movie_id` int(11) NOT NULL AUTO_INCREMENT,
	  `movie_name` varchar(60) DEFAULT NULL,
	  `movie_vote_id` int(11) DEFAULT NULL,
	  `thumbnail_url` varchar(200) DEFAULT NULL,
	  `movie_url` varchar(200) DEFAULT NULL,
	  `votes_for` int(11) DEFAULT '0',
	  `votes_against` int(11) DEFAULT '0',
	  PRIMARY KEY (`movie_id`),
	  UNIQUE KEY `movie_name_vote` (`movie_name`,`movie_vote_id`),
	  KEY `movie_vote` (`movie_vote_id`)
	) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=latin1


	CREATE TABLE `movie_vote` (
	  `movie_vote_id` int(11) NOT NULL AUTO_INCREMENT,
	  `end_date` datetime DEFAULT NULL,
	  PRIMARY KEY (`movie_vote_id`)
	) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1

}
