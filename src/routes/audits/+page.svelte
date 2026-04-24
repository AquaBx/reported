<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { useClipboard } from '@vueuse/core'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()
const { copy } = useClipboard()

interface Audit {
  _id: string
  name: string
  client: {
    name: string
    shortname: string
  }
  date_start?: string
  date_end?: string
  state: 'In Progress' | 'Review' | 'Approved' | 'Cancelled'
}

const endpoint = computed(() => "/api/audits")

const { data } = await useFetch<Audit[]>(endpoint, {
  default: () => [],
})

const columns: TableColumn<Audit>[] = [{
  accessorKey: '_id',
  header: '#',
  cell: ({ row }) => `#${row.original._id.slice(-6)}`
}, {
  accessorKey: 'name',
  header: 'Audit Name'
}, {
  id: 'client',
  header: ({ column }) => {
    const isSorted = column.getIsSorted()

    return h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      label: 'Customer',
      icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
      class: '-mx-2.5',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
    })
  },
  cell: ({ row }) => row.original.client?.name || 'N/A'
}, {
  accessorKey: 'date_start',
  header: 'From',
  cell: ({ row }) => {
    if (!row.original.date_start) return '-'
    return new Date(row.original.date_start).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }
}, {
  accessorKey: 'date_end',
  header: 'To',
  cell: ({ row }) => {
    if (!row.original.date_end) return '-'
    return new Date(row.original.date_end).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }
}, {
  accessorKey: 'state',
  header: 'Status',
  cell: ({ row }) => {
    const status = row.original.state
    const color = ({
      'Cancelled': 'error' as const,
      'Approved': 'success' as const,
      'Review': 'warning' as const,
      'In Progress': 'info' as const
    })[status] || 'neutral'

    return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => status)
  }
}, {
  id: 'actions',
  enableHiding: false,
  meta: {
    class: {
      td: 'text-right'
    }
  },
  cell: ({ row }) => {
    const items = [{
      type: 'label',
      label: 'Actions'
    }, {
      label: 'Copy Audit ID',
      onSelect() {
        copy(row.original._id)

        toast.add({
          title: 'Audit ID copied to clipboard!',
          color: 'success',
          icon: 'i-lucide-circle-check'
        })
      }
    }, {
      label: row.getIsExpanded() ? 'Collapse' : 'Expand',
      onSelect() {
        row.toggleExpanded()
      }
    }, {
      type: 'separator'
    }, {
      label: 'Open Audit',
      to: `/audits/${row.original._id}`
    }]

    return h(UDropdownMenu, {
      'content': {
        align: 'end'
      },
      items,
      'aria-label': 'Actions dropdown'
    }, () => h(UButton, {
      'icon': 'i-lucide-ellipsis-vertical',
      'color': 'neutral',
      'variant': 'ghost',
      'aria-label': 'Actions dropdown'
    }))
  }
}]

</script>

<template>
  <div class="size-full flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Audits</h1>
      <UButton icon="i-lucide-plus" label="New Audit" color="primary" />
    </div>

    <UTable
      ref="table"
      :data="data"
      :columns="columns"
      sticky
      class="flex-1"
    >
      <template #expanded="{ row }">
        <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-xs">{{ row.original }}</pre>
      </template>
    </UTable>
  </div>
</template>