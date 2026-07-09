import { useMutation, useQueryClient } from '@tanstack/react-query'

import { signOut } from '@/services/auth/auth.service'

import { deleteCurrentUserPublicData } from '../services/settings.service'

export function useDeleteAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await deleteCurrentUserPublicData()
      await signOut()
    },
    onSuccess: async () => {
      await queryClient.clear()
    },
  })
}
