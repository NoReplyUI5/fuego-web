module.exports = {
  port: 6080,
  siteUrl: 'https://mesuic.qzz.io',
  statsUpstream: 'http://44.194.24.194:3000/stats',
  cacheTtl: 300, // seconds

  redis: {
    url: 'https://handy-newt-155356.upstash.io',
    token: 'gQAAAAAAAl7cAAIgcDJkM2JhNWFlZTFiMzE0Y2Y2OWI1MjYyZmVmYzUwOTc0MA',
  },

  turso: {
    url: 'https://fuegoqzzio-painfueg0.aws-us-east-1.turso.io',
    token: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODI4NDI5MjcsImlkIjoiMDE5ZjE5YjItYjUwMS03YjVmLTllMDItODQ2ODljNmVmMTU0Iiwia2lkIjoiNHk1NXdtdDN0TUFFcW9mSTB3NkhVM0VpdWxDME9rV1VBZFdYOTl0dWJBVSIsInJpZCI6Ijc1MjhlZTY0LTgxOTctNGVjOS05NmQ3LTU4MTUzMGQ2YzViMyJ9.m3vm1ttdZQE_zLFJ4ugO20fH_XnKL-WjxkuBnomBTiLTepmDTXFHc44kWl1I73eOMSqZRiRaFm5Hm_rZ1d_KCw',
  },
};
