export default interface IMapper<To> {
  map: (from: any) => To,
  unmap: (from: To) => any
}