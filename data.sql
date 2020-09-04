
CREATE TABLE "lists" (
    "id" serial   NOT NULL,
    "name" text   NOT NULL,
    "user_id" int   NOT NULL,
    CONSTRAINT "pk_lists" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "users" (
    "id" serial   NOT NULL,
    "username" text   NOT NULL,
    "password" text   NOT NULL,
    "cash" float   NOT NULL,
    CONSTRAINT "pk_users" PRIMARY KEY (
        "id"
     ),
    CONSTRAINT "uc_users_username" UNIQUE (
        "username"
    )
);

CREATE TABLE "stocks" (
    "id" serial   NOT NULL,
    "ticker" text   NOT NULL,
    "list_id" int   NOT NULL,
    CONSTRAINT "pk_stocks" PRIMARY KEY (
        "id"
     )
);

ALTER TABLE "lists" ADD CONSTRAINT "fk_lists_user_id" FOREIGN KEY("user_id")
REFERENCES "users" ("id");

ALTER TABLE "stocks" ADD CONSTRAINT "fk_stocks_list_id" FOREIGN KEY("list_id")
REFERENCES "lists" ("id");
