# Todo example using Supabase, Vue.js & TypeScript

- Frontend:
  - Vue 3, TypeScript
  - [Supabase.js](https://supabase.io/docs/library/getting-started) for user management and realtime data syncing.
- Backend:
  - [app.supabase.io](https://app.supabase.io/): hosted Postgres database with restful API for usage with Supabase.js.

## Deploy your own

### 1. Create new project

Sign up to Supabase - [https://app.supabase.io](https://app.supabase.io) and create a new project. Wait for your database to start.

### 2. Run "Todo List" Quickstart

Once your database has started, run the "Todo List" quickstart. Inside of your project, enter the `SQL editor` tab and scroll down until you see `TODO LIST: Build a basic todo list with Row Level Security`.

### 3. Get the URL and Key

Go to the Project Settings (the cog icon), open the API tab, and find your API URL and `anon` key, you'll need these in the next step.

The `anon` key is your client-side API key. It allows "anonymous access" to your database, until the user has logged in. Once they have logged in, the keys will switch to the user's own login token. This enables row level security for your data. Read more about this [below](#postgres-row-level-security).

![image](https://user-images.githubusercontent.com/10214025/88916245-528c2680-d298-11ea-8a71-708f93e1ce4f.png)

**_NOTE_**: The `service_role` key has full access to your data, bypassing any security policies. These keys have to be kept secret and are meant to be used in server environments and never on a client or browser.

### 4. Deploy the Vue.js client

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/supabase/supabase/tree/master/examples/vue3-ts-todo-list&env=VUE_APP_SUPABASE_URL,VUE_APP_SUPABASE_KEY&envDescription=Find%20the%20Supabase%20URL%20and%20key%20in%20the%20your%20auto-generated%20docs%20at%20app.supabase.io&project-name=supabase-todo-list&repo-name=supabase-todo-list)

Here, we recommend forking this repo so you can deploy through Vercel by clicking the button above. When you click the button, replace the repo URL with your fork's URL.

You will be asked for a `VUE_APP_SUPABASE_URL` and `VUE_APP_SUPABASE_KEY`. Use the API URL and `anon` key from [step 3](#3.-get-the-url-and-key).

### 5. Change authentication settings if necessary

![Change auth settings](https://user-images.githubusercontent.com/1811651/101840012-39be3800-3af8-11eb-8c32-73f2fae6299e.png)

On [app.supabase.io](https://app.supabase.io), you can go to Authentication -> Settings to change your auth settings for your project if necessary. Here, you can change the site URL, which is used for determining where to redirect users after they confirm their email addresses or attempt to use a magic link to log in.

Here, you can also enable external oauth providers, such as Google and GitHub.

## Supabase details

### Postgres Row level security

This project uses very high-level Authorization using Postgres' Role Level Security.
When you start a Postgres database on Supabase, we populate it with an `auth` schema, and some helper functions.
When a user logs in, they are issued a JWT with the role `authenticated` and their UUID.
We can use these details to provide fine-grained control over what each user can and cannot do.

This is a trimmed-down schema, with the policies:

```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
drop function if EXISTS public.handle_new_account();
drop table if EXISTS public.posts;
drop table if EXISTS public.account;
drop table if EXISTS public.likes;



create table public.account (
  id uuid references auth.users not null CONSTRAINT users_id_pk PRIMARY KEY,
  email varchar(255)
);

create table public.posts (
  id bigint generated by default as identity primary key,
  user_id uuid references public.account(id) not null,
  task text check (char_length(task) > 3),
  is_complete boolean default false,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.likes (
  id bigint generated by default as identity primary key,
  account_id uuid not null ,
  post_id int not null ,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create function public.handle_new_account() 
returns trigger as $$
begin
  insert into public.account (id, email)
  values (new.id, new.email)
  return new;
end;
$$ language plpgsql security definer;

-- trigger the function every time a user is created
  create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_account();
```

## Authors

- [Supabase](https://supabase.io)
- [Alex Chiu](https://github.com/chiubaca)
- [YK Sugi](https://twitter.com/ykdojo)

Supabase is open source, we'd love for you to follow along and get involved at https://github.com/supabase/supabase

## Local development

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```
