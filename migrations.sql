create table users
(
    id serial
        constraint users_pk
            primary key,
    email     text not null,
    password_hash  text,
    google_id text,
    facebook_id text,
    organization_id text,
    swish_number text,
    stripe_account_id text,
    created timestamp with time zone default CURRENT_TIMESTAMP not null,
    last_updated timestamp with time zone default CURRENT_TIMESTAMP not null
);

create unique index users_email_uindex
    on users (email);

create table sessions
(
    id      text,
    user_id integer
        constraint sessions_users_id_fk
            references users (id),
    created timestamp with time zone default CURRENT_TIMESTAMP not null,
    ip_address INET
);

create unique index sessions_id_uindex
    on sessions (id);

create table users_pending
(
    verification_token varchar(21) not null
        constraint users_pending_pk
            primary key,
    email text not null,
    password_hash text not null,
    created timestamp with time zone default CURRENT_TIMESTAMP not null
);

create table oauth_states
(
    id      text,
    created timestamp with time zone default CURRENT_TIMESTAMP not null,
    ip_address INET
);

create unique index oauth_states_id_uindex
    on oauth_states (id);

create table users_password_reset
(
    reset_token varchar(21)
        constraint users_password_reset_pk
            primary key,
    user_id int
        constraint users_password_reset_users_id_fk
            references users,
    created timestamp with time zone default CURRENT_TIMESTAMP not null
);

create type form_status as enum ('open', 'closed', 'deleted');

create table forms
(
    id varchar(8) not null
        constraint forms_pk
            primary key,
    user_id integer
        constraint forms_users_id_fk
            references users (id),
    slug text,
    status form_status default 'open'::form_status not null,
    title text,
    custom_fields jsonb default '[]'::jsonb not null,
    created timestamp with time zone default CURRENT_TIMESTAMP not null,
    last_updated timestamp with time zone default CURRENT_TIMESTAMP not null
);

create index forms_user_id_index
    on forms (user_id);

create table forms_tickets
(
    id serial
        constraint forms_tickets_pk
            primary key,
    form_id varchar(8)
        constraint forms_tickets_forms_id_fk
            references forms,
    description varchar(100),
    price int,
    vat_rate decimal(3, 2),
    seats int
);

create unique index forms_tickets_form_id_description_uindex
    on forms_tickets (form_id, description);

create table forms_receipt
(
    form_id varchar(8)
        constraint forms_receipt_pk
            primary key
        constraint forms_receipt_forms_id_fk
            references forms,
    custom_message text,
    created timestamp with time zone default CURRENT_TIMESTAMP not null,
    last_updated timestamp with time zone default CURRENT_TIMESTAMP not null
);

create type order_status as enum ('pending', 'aborted', 'cancelled', 'completed');

create table orders
(
    id serial not null
        constraint orders_pk
            primary key,
    status order_status default 'pending'::order_status not null,
    total decimal(12, 2),
    vat decimal(12, 2),
    form_id varchar(8)
        constraint orders_forms_id_fk
            references forms
            on update cascade on delete cascade,
    reference_number varchar(8) not null,
    fields_with_values jsonb default '[]'::jsonb not null,
    note text,
    receipt_sent boolean default false not null,
    swish jsonb,
    stripe jsonb,
    created timestamp with time zone default CURRENT_TIMESTAMP not null,
    last_updated timestamp with time zone default CURRENT_TIMESTAMP not null
);

create unique index orders_form_id_reference_number_uindex
    on orders (form_id, reference_number);

create table orders_tickets
(
    order_id int
        constraint orders_tickets_orders_id_fk
            references orders,
    ticket_id int
        constraint orders_tickets_tickets_id_fk
            references forms_tickets,
    amount int
);

create table message_history
(
    id serial not null
        constraint message_history_pk
            primary key,
    form_id varchar(8)
        constraint message_history_forms_id_fk
            references forms
            on update cascade on delete cascade,
    recipient_emails text,
    subject text,
    body text,
    created timestamp with time zone default CURRENT_TIMESTAMP not null
);

create index message_history_form_id_index
    on message_history (form_id);

create table logs
(
    id serial
        constraint logs_pk
            primary key,
    key text not null,
    value jsonb,
    created timestamp with time zone default CURRENT_TIMESTAMP not null
);
