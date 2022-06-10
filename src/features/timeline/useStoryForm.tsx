import { useEffect, useReducer, useState } from 'react'
import {
  BooleanInput,
  Story,
  NumberArrayInput,
  NumberInput,
  StringInput,
} from '../../app/types'

interface State {
  title: StringInput
  detail: StringInput
  color: StringInput
  tagIds: NumberArrayInput
  isArchived: BooleanInput
  happenedAt: NumberInput
}

const initialState: State = {
  title: { value: '', error: null },
  detail: { value: '', error: null },
  color: { value: '', error: null },
  tagIds: { value: [], error: null },
  isArchived: { value: false, error: null },
  happenedAt: { value: 0, error: null },
}

export type UpdateArgument = {
  title?: StringInput
  detail?: StringInput
  color?: StringInput
  tagIds?: NumberArrayInput
  happenedAt?: NumberInput
  isArchived?: BooleanInput
}

const reducer = (
  state: State,
  action: { payload: UpdateArgument; type: 'update' }
) => {
  switch (action.type) {
    case 'update':
      return { ...state, ...action.payload }
    default:
      return { ...state }
  }
}

export const useStoryForm = () => {
  const [story, setStory] = useState<Story | null>(null)
  const [state, dispatch] = useReducer(reducer, initialState)

  const update = (value: UpdateArgument) => {
    dispatch({ type: 'update', payload: value })
  }

  useEffect(() => {
    if (story === null) return
    update({
      title: { value: story.title, error: null },
      detail: { value: story.detail, error: null },
      tagIds: { value: [...story.tagIds], error: null },
      color: { value: story.color, error: null },
      isArchived: { value: story.isArchived, error: null },
      happenedAt: { value: story.happenedAt, error: null },
    })
  }, [story])

  const generateStory = () => {
    return {
      ...(story === null ? {} : story),
      title: state.title.value,
      detail: state.detail.value,
      tagIds: state.tagIds.value,
      color: state.color.value,
      isArchived: state.isArchived.value,
      happenedAt: state.happenedAt.value,
    }
  }

  return { state, update, generateStory, setStory }
}
