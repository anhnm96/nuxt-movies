<script setup lang="ts">
import type { ExternalIds } from 'types'

const props = defineProps<{
  ids: ExternalIds
}>()

const externalIds = (function () {
  if (!props.ids) return []
  const res = []
  for (const [key, value] of Object.entries(props.ids)) {
    const id = key.substring(0, key.length - 3)
    let link
    if (!value) continue
    if (id === 'imdb') {
      link = `https://imdb.com/title/${value}`
    } else if (id === 'wikidata') {
      link = `https://wikidata.org/wiki/${value}`
    } else if (['facebook', 'twitter', 'github'].includes(id)) {
      link = `https://${id}.com/${value}`
    } else continue

    res.push({
      id,
      link,
      icon: `simple-icons:${id}`,
    })
  }

  if (props.ids.email)
    res.push({
      id: 'email',
      link: `mailto:${props.ids.email}`,
      icon: 'octicon:mail-24',
    })

  if (props.ids.homepage)
    res.push({
      id: 'homepage',
      link: props.ids.homepage,
      icon: 'i-ph-link-simple',
    })

  return res
})()
</script>

<template>
  <ul class="-ml-[0.6875rem] flex">
    <li v-for="e in externalIds" :key="e.id">
      <a
        class="text-anim inline-flex h-11 w-11 items-center justify-center hover:text-primary"
        :href="e.link"
        target="_blank"
        :aria-label="`Link to ${e.id} account`"
        rel="noopener noreferrer"
      >
        <Icon :name="e.icon" size="1.375em" />
      </a>
    </li>
  </ul>
</template>
