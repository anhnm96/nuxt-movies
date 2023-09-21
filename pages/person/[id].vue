<script setup lang="ts">
import { TMDB_IMAGE_BASE } from '@/constants/images'

const route = useRoute()
const id = route.params.id as string
const person = await getPerson(id)

useHead({
  title: person.name,
  meta: [
    { name: 'description', content: person.biography || person.name },
    {
      property: 'og:image',
      content: `${TMDB_IMAGE_BASE}/w55${person.profile_path}`,
    },
  ],
})

function formatContent(str: string) {
  return str
    .split('\n\n')
    .map((section) => `<p>${section}</p>`)
    .join('<br>')
}

const externalIds = (function () {
  if (!person.external_ids) return []
  const res = []
  for (const [key, value] of Object.entries(person.external_ids)) {
    const id = key.substring(0, key.length - 3)
    let link
    if (!value) continue
    if (id === 'imdb') {
      link = `https://imdb.com/title/${value}`
    } else if (id === 'wikidata') {
      link = `https://wikidata.org/wiki/${value}`
    } else if (['facebook', 'twitter'].includes(id)) {
      link = `https://${id}.com/${value}`
    } else continue

    res.push({
      id,
      link,
      icon: `simple-icons:${id}`,
    })
  }

  if (person.homepage)
    res.push({
      id: 'homepage',
      link: person.homepage,
      icon: 'i-ph-link-simple',
    })

  return res
})()
</script>

<template>
  <main class="margin-section wrapper mx-auto pt-16 lg:container">
    <div class="flex flex-wrap gap-8 sm:flex-nowrap xl:gap-12">
      <div class="w-1/4 max-w-md flex-shrink-0">
        <img
          v-if="person.profile_path"
          :src="`${TMDB_IMAGE_BASE}/w370_and_h556_bestv2${person.profile_path}`"
          :alt="person.name"
        />
      </div>
      <div>
        <div v-html="formatContent(person.biography)"></div>
        <ul class="margin-section grid grid-cols-[auto_1fr] gap-x-6 gap-y-3">
          <li v-if="person.known_for_department" class="contents">
            <p>Known For</p>
            <p>{{ person.known_for_department }}</p>
          </li>
          <li v-if="person.birthday" class="contents">
            <p>Born</p>
            <p>{{ person.birthday }}</p>
          </li>
          <li v-if="person.place_of_birth" class="contents">
            <p>Place of Birth</p>
            <p>{{ person.place_of_birth }}</p>
          </li>
        </ul>
        <ul class="margin-section -ml-[0.6875rem] flex">
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
      </div>
    </div>
  </main>
</template>
