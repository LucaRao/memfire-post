declare interface Credentials {
  email?: string | undefined
  password?: string | undefined
  provider?: 'bitbucket' | 'github' | 'gitlab' | 'google' | undefined
}

declare interface Todo {
  id?: number
  email?: string
  task: string
  inserted_at?: string
}
