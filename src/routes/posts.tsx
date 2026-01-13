import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  type Post,
} from '~/server/posts'

export const Route = createFileRoute('/posts')({
  loader: () => getPosts(),
  component: PostsPage,
})

function PostsPage() {
  const posts = Route.useLoaderData()
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await createPost({
      data: {
        title: formData.get('title') as string,
        content: formData.get('content') as string,
      },
    })
    setIsCreating(false)
    router.invalidate()
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>, id: number) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await updatePost({
      data: {
        id,
        title: formData.get('title') as string,
        content: formData.get('content') as string,
      },
    })
    setEditingId(null)
    router.invalidate()
  }

  const handleDelete = async (id: number) => {
    await deletePost({ data: id })
    router.invalidate()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground">
            Full CRUD demo with server functions
          </p>
        </div>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>New Post</Button>
        )}
      </div>

      {isCreating && (
        <Card>
          <form onSubmit={handleCreate}>
            <CardHeader>
              <CardTitle>Create Post</CardTitle>
              <CardDescription>Add a new post to the database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter post title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Enter post content"
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button type="submit">Create</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {posts.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No posts yet. Create your first post!
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isEditing={editingId === post.id}
              onEdit={() => setEditingId(post.id)}
              onCancelEdit={() => setEditingId(null)}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function PostCard({
  post,
  isEditing,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
}: {
  post: Post
  isEditing: boolean
  onEdit: () => void
  onCancelEdit: () => void
  onUpdate: (e: React.FormEvent<HTMLFormElement>, id: number) => Promise<void>
  onDelete: (id: number) => Promise<void>
}) {
  if (isEditing) {
    return (
      <Card>
        <form onSubmit={(e) => onUpdate(e, post.id)}>
          <CardHeader>
            <CardTitle>Edit Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`title-${post.id}`}>Title</Label>
              <Input
                id={`title-${post.id}`}
                name="title"
                defaultValue={post.title}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`content-${post.id}`}>Content</Label>
              <Textarea
                id={`content-${post.id}`}
                name="content"
                defaultValue={post.content ?? ''}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={onCancelEdit}>
              Cancel
            </Button>
          </CardFooter>
        </form>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{post.title}</CardTitle>
            <CardDescription>
              {new Date(post.created_at).toLocaleDateString()}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Post</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{post.title}"? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(post.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      {post.content && (
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {post.content}
          </p>
        </CardContent>
      )}
    </Card>
  )
}
