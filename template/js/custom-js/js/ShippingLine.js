import {
    i19days,
    i19free,
    i19freeShipping,
    // i19pickUpToday,
    i19receiveToday,
    i19untilTomorrow,
    i19upTo,
    i19workingDays
  } from '@ecomplus/i18n'
  
  import {
    i18n,
    formatMoney
  } from '@ecomplus/utils'
  
  const i19pickUpToday = 'Retire hoje'
  
  export default {
    name: 'ShippingLine',
  
    props: {
      shippingLine: {
        type: Object,
        required: true
      },
      productionDeadline: {
        type: Number,
        default: 0
      },
      serviceCode: {
        type: String,
        required: false
      }
    },
  
    computed: {
      deadlineStr () {
        const shipping = this.shippingLine
        const isWorkingDays = (shipping.posting_deadline && shipping.posting_deadline.working_days) ||
          (shipping.delivery_time && shipping.delivery_time.working_days)
        let days = shipping.posting_deadline ? shipping.posting_deadline.days : 0
        if (shipping.delivery_time) {
          days += shipping.delivery_time.days
        }
        days += this.productionDeadline
        const date = new Date()
        const today = date.getDay()
        const hour = date.getHours()
        if (((today === 6) || (today === 0) || ((today === 5) && hour >= 11)) && this.serviceCode && this.serviceCode.includes('retire')) {
          return 'Na segunda, após as 14h'
        } else if (((today > 0 && today < 6  && hour < 11)) && this.serviceCode && this.serviceCode.includes('retire')) {
          return 'Retire Hoje, após as 14h'
        } else if (((today > 0 && today < 6  && hour >= 11)) && this.serviceCode && this.serviceCode.includes('retire')) {
          return 'A partir de amanhã, após as 14h'
        }
        if (((today === 6) || (today === 0) || ((today === 5) && hour >= 11)) && this.serviceCode && this.serviceCode.includes('avulso')) {
          return 'Receba segunda-feira'
        } else if (((today > 0 && today < 6  && hour < 11)) && this.serviceCode && this.serviceCode.includes('avulso')) {
          return 'Receba Hoje'
        } else if (((today > 0 && today < 6  && hour >= 11)) && this.serviceCode && this.serviceCode.includes('avulso')) {
          return 'Receba amanhã'
        }
        if (days) {
          return `${i18n(i19upTo)} ${days} ` +
            i18n(isWorkingDays ? i19workingDays : i19days).toLowerCase()
        }
      },
  
      freightValueStr () {
        const { shippingLine } = this
        const freight = typeof shippingLine.total_price === 'number'
          ? shippingLine.total_price
          : shippingLine.price
        if (freight) {
          return formatMoney(freight)
        } else {
          return i18n(shippingLine.pick_up ? i19free : i19freeShipping)
        }
      }
    }
  }
