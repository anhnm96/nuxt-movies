<script lang="ts">
export default defineComponent({
  name: 'InfiniteLoad',
  emits: ['infiniteLoad'],
  setup(_props, { emit }) {
    const containerRef = ref()
    useIntersectionObs(containerRef, () => emit('infiniteLoad'))

    return () => h('div', { ref: containerRef })
  },
})
</script>
