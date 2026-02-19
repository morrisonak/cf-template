import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

type SettingItem = { key: string; value: string }

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const queryClient = useQueryClient()
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await fetch('/api/settings')
      if (!res.ok) throw new Error('Failed to load settings')
      return res.json() as Promise<SettingItem[]>
    },
  })

  const addMutation = useMutation({
    mutationFn: async (data: { key: string; value: string }) => {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to save setting')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      setNewKey('')
      setNewValue('')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (key: string) => {
      const res = await fetch(`/api/settings?key=${encodeURIComponent(key)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete setting')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  })

  const handleAddSetting = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newKey.trim() || !newValue.trim()) return
    addMutation.mutate({ key: newKey.trim(), value: newValue.trim() })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Key-value storage powered by Cloudflare KV
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Setting</CardTitle>
          <CardDescription>Store a new key-value pair in Cloudflare KV</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSetting} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="key">Key</Label>
                <Input
                  id="key"
                  placeholder="my-setting"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  disabled={addMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  placeholder="some value"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  disabled={addMutation.isPending}
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={addMutation.isPending || !newKey.trim() || !newValue.trim()}
            >
              {addMutation.isPending ? 'Saving...' : 'Add Setting'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stored Settings</CardTitle>
          <CardDescription>
            {isLoading
              ? 'Loading...'
              : `${settings.length} setting${settings.length !== 1 ? 's' : ''} in KV storage`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {settings.length === 0 && !isLoading ? (
            <p className="text-center text-muted-foreground py-8">
              No settings stored yet
            </p>
          ) : (
            <div className="divide-y">
              {settings.map((setting) => (
                <SettingRow
                  key={setting.key}
                  setting={setting}
                  onDelete={(key) => deleteMutation.mutate(key)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CacheDemo />
    </div>
  )
}

function SettingRow({
  setting,
  onDelete,
}: {
  setting: SettingItem
  onDelete: (key: string) => void
}) {
  return (
    <div className="flex items-center justify-between py-3 gap-4">
      <div className="min-w-0 flex-1">
        <p className="font-mono text-sm font-medium">{setting.key}</p>
        <p className="text-sm text-muted-foreground truncate">{setting.value}</p>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Setting</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{setting.key}"? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(setting.key)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function CacheDemo() {
  const [cacheKey, setCacheKey] = useState('demo')
  const [cacheResult, setCacheResult] = useState<{
    value: string
    fromCache: boolean
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFetch = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/cache/${cacheKey}`)
      if (!res.ok) throw new Error('Failed to fetch')
      setCacheResult(await res.json())
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = async () => {
    setIsLoading(true)
    try {
      await fetch(`/api/cache/${cacheKey}`, { method: 'DELETE' })
      setCacheResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cache Demo</CardTitle>
        <CardDescription>
          Demonstrates KV as a cache layer with 60-second TTL
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 items-end">
          <div className="space-y-2 flex-1">
            <Label htmlFor="cache-key">Cache Key</Label>
            <Input
              id="cache-key"
              value={cacheKey}
              onChange={(e) => setCacheKey(e.target.value)}
              placeholder="demo"
            />
          </div>
          <Button onClick={handleFetch} disabled={isLoading || !cacheKey}>
            {isLoading ? 'Loading...' : 'Fetch Value'}
          </Button>
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={isLoading || !cacheKey}
          >
            Clear Cache
          </Button>
        </div>

        {cacheResult && (
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  cacheResult.fromCache
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                }`}
              >
                {cacheResult.fromCache ? 'FROM CACHE' : 'COMPUTED'}
              </span>
            </div>
            <p className="font-mono text-sm break-all">{cacheResult.value}</p>
            <p className="text-xs text-muted-foreground">
              {cacheResult.fromCache
                ? 'Value retrieved from KV cache. Click "Clear Cache" and fetch again to see a new computed value.'
                : 'Value was computed and cached with 60-second TTL. Fetch again within 60 seconds to see cached response.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
