import { Search } from "lucide-react"
import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchFormProps {
  defaultValue?: string
}

export function SearchForm({ defaultValue = "" }: SearchFormProps) {
  const navigate = useNavigate()
  const [value, setValue] = useState(defaultValue)

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return

    navigate(`/tx/${encodeURIComponent(trimmed)}`)
  }

  return (
    <form className="flex flex-col gap-3 sm:flex-row" onSubmit={onSubmit}>
      <Input
        aria-label="Search extrinsic"
        className="h-12 flex-1"
        placeholder="Enter extrinsic hash or id"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <Button className="h-12 px-5" type="submit">
        <Search className="size-4" />
        Search
      </Button>
    </form>
  )
}
