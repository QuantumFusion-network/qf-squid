import { Search } from "lucide-react"
import { FormEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchFormProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}

export function SearchForm({
  defaultValue = "",
  value: controlledValue,
  onValueChange,
}: SearchFormProps) {
  const navigate = useNavigate()
  const [value, setValue] = useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const currentValue = isControlled ? controlledValue : value

  useEffect(() => {
    if (!isControlled) {
      setValue(defaultValue)
    }
  }, [defaultValue, isControlled])

  function updateValue(nextValue: string) {
    if (isControlled) {
      onValueChange?.(nextValue)
      return
    }

    setValue(nextValue)
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = currentValue.trim()
    if (!trimmed) return

    navigate(`/tx/${encodeURIComponent(trimmed)}`)
  }

  return (
    <form className="flex flex-col gap-3 sm:flex-row" onSubmit={onSubmit}>
      <Input
        aria-label="Search transfer"
        className="h-12 flex-1"
        autoCapitalize="off"
        autoCorrect="off"
        placeholder="Transaction hash or Extrinsic ID"
        value={currentValue}
        onChange={(event) => updateValue(event.target.value)}
      />
      <Button className="h-12 px-5" type="submit">
        <Search className="size-4" />
        Search
      </Button>
    </form>
  )
}
