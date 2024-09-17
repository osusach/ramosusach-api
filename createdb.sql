CREATE TABLE faculty (
  id INTEGER PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  is_active TINYINT DEFAULT 1 NOT NULL,
  creation_date TEXT NOT NULL DEFAULT current_timestamp,
  modification_date TEXT NOT NULL DEFAULT current_timestamp
);

CREATE INDEX faculty_id_index ON faculty(id);

CREATE TABLE career (
  id INTEGER PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  faculty_id INTEGER NOT NULL,
  is_active TINYINT DEFAULT 0 NOT NULL,
  creation_date TEXT NOT NULL DEFAULT current_timestamp,
  modification_date TEXT NOT NULL DEFAULT current_timestamp
);

CREATE INDEX career_id_index ON career(id);


CREATE TABLE career_course (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  career_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  level INTEGER NOT NULL,
  UNIQUE(career_id, course_id)
);

CREATE INDEX career_course_career_id_index on career_course(career_id);
CREATE INDEX career_course_course_id_index on career_course(course_id);


CREATE TABLE course (
  id INTEGER PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  duration TEXT DEFAULT 'S' NOT NULL,
  vote_count INTEGER DEFAULT 0 NOT NULL,
  difficulty_mean FLOAT DEFAULT 0 NOT NULL,
  time_demand_mean FLOAT DEFAULT 0 NOT NULL,
  is_active TINYINT DEFAULT 0 NOT NULL,
  creation_date TEXT NOT NULL DEFAULT current_timestamp,
  modification_date TEXT NOT NULL DEFAULT current_timestamp
);

CREATE INDEX course_id_index ON course(id);
CREATE INDEX course_id_is_active_index ON course(id, is_active);



CREATE TABLE teacher (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  name TEXT NOT NULL,
  vote_count INTEGER DEFAULT 0 NOT NULL,
  strictness_mean FLOAT DEFAULT 0 NOT NULL,
  pedagogical_skill_mean FLOAT DEFAULT 0 NOT NULL,
  creation_date TEXT NOT NULL DEFAULT current_timestamp,
  modification_date TEXT NOT NULL DEFAULT current_timestamp,
  UNIQUE(name)
);

CREATE INDEX teacher_id_index ON teacher(id);
CREATE INDEX teacher_name_index ON teacher(name);



CREATE TABLE section (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  code TEXT NOT NULL,
  course_id INTEGER NOT NULL,
  course_type TEXT NOT NULL DEFAULT 'T',
  quota INTEGER NOT NULL DEFAULT 0,
  signed_up INTEGER NOT NULL DEFAULT 0,
  period TEXT NOT NULL,
  schedule TEXT NOT NULL,
  creation_date TEXT NOT NULL DEFAULT current_timestamp,
  modification_date TEXT NOT NULL DEFAULT current_timestamp,
  UNIQUE(code, course_id, period)
);


CREATE INDEX section_course_id_index ON section(course_id);
CREATE INDEX section_course_id_period_index on section(course_id, period);
CREATE INDEX section_period_index ON section(period);
CREATE INDEX section_id_index ON section(id);


CREATE TABLE teacher_section (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  teacher_id INTEGER NOT NULL,
  section_id INTEGER NOT NULL,
  UNIQUE(teacher_id, section_id)
);

CREATE INDEX teacher_section_teacher_id_index ON teacher_section(teacher_id);
CREATE INDEX teacher_section_section_id_index ON teacher_section(section_id);



CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  sub TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  profile_img TEXT,
  is_admin TINYINT NOT NULL DEFAULT 0,
  creation_date TEXT NOT NULL DEFAULT current_timestamp,
  modification_date TEXT NOT NULL DEFAULT current_timestamp,
  UNIQUE(sub)
);


CREATE INDEX user_id_index ON user(id);
CREATE INDEX user_sub_index ON user(sub);



CREATE TABLE career_section (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  career_id INTEGER NOT NULL,
  section_id INTEGER NOT NULL,
  UNIQUE(career_id, section_id)
);

CREATE INDEX career_section_career_id_index on career_section(career_id);
CREATE INDEX career_section_section_id_index on career_section(section_id);


CREATE TABLE course_vote (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  course_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  difficulty_score INTEGER NOT NULL DEFAULT 1,
  time_demand_score INTEGER NOT NULL DEFAULT 1,
  UNIQUE(course_id, user_id),
  FOREIGN KEY (course_id) REFERENCES course(id),
  FOREIGN KEY (user_id) REFERENCES user(id)
);


CREATE INDEX course_vote_course_id_index ON course_vote(course_id);
CREATE INDEX course_vote_user_id_index ON course_vote(user_id);
CREATE INDEX course_vote_course_id_user_id_index ON course_vote(course_id, user_id);

CREATE TABLE teacher_vote (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  teacher_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  strictness_score INTEGER NOT NULL DEFAULT 1,
  pedagogical_skill_score INTEGER NOT NULL DEFAULT 1,
  UNIQUE(teacher_id, user_id),
  FOREIGN KEY (teacher_id) REFERENCES teacher(id),
  FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE INDEX teacher_vote_teacher_id ON teacher_vote(teacher_id);
CREATE INDEX teacher_vote_user_id ON teacher_vote(user_id);
CREATE INDEX teacher_vote_teacher_id_user_id_index ON teacher_vote(teacher_id, user_id);


CREATE TABLE course_comment (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  course_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  parent_id INTEGER,
  content TEXT NOT NULL,
  reply_count INTEGER NOT NULL DEFAULT 0,
  upvotes INTEGER NOT NULL DEFAULT 0,
  creation_date TEXT NOT NULL DEFAULT current_timestamp,
  modification_date TEXT NOT NULL DEFAULT current_timestamp,
  FOREIGN KEY (course_id) REFERENCES course(id),
  FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE INDEX course_comment_course_id_index ON course_comment(course_id);
CREATE INDEX course_comment_user_id_index ON course_comment(user_id);
CREATE INDEX course_comment_parent_id_index ON course_comment(parent_id);
CREATE INDEX course_comment_course_id_user_id_index ON course_comment(course_id, user_id);
CREATE INDEX course_comment_parent_id_user_id_index ON course_comment(parent_id, user_id);

CREATE TABLE course_comment_vote (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  comment_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  is_upvote TINYINT NOT NULL DEFAULT 1,
  UNIQUE(comment_id, user_id),
  FOREIGN KEY (comment_id) REFERENCES course_comment(id)
);

CREATE INDEX course_comment_vote_comment_id_index ON course_comment_vote(comment_id);
CREATE INDEX course_comment_vote_user_id_index ON course_comment_vote(user_id);
CREATE INDEX course_comment_vote_comment_id_user_id_index ON course_comment_vote(comment_id, user_id);


