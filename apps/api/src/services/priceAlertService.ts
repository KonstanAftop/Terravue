import { PriceAlert } from '@terravue/shared'
import { generateId } from '@terravue/shared'
import { marketService } from './marketService.js'

interface CreateAlertRequest {
  targetPrice: number
  condition: 'above' | 'below' | 'crosses'
  region?: string
  notificationMethods: ('browser' | 'email')[]
}

export class PriceAlertService {
  private alerts: Map<string, PriceAlert> = new Map()
  private priceHistory: Map<string, number> = new Map()
  private monitoringIntervals: Map<string, NodeJS.Timeout> = new Map()

  /**
   * Create a new price alert
   */
  async createAlert(userId: string, alertData: CreateAlertRequest): Promise<PriceAlert> {
    const alert: PriceAlert = {
      id: generateId(),
      userId,
      targetPrice: alertData.targetPrice,
      condition: alertData.condition,
      region: alertData.region,
      isActive: true,
      createdAt: new Date(),
      notificationMethods: alertData.notificationMethods,
    }

    this.alerts.set(alert.id, alert)

    // Start monitoring this alert
    this.monitorAlert(alert)

    return alert
  }

  /**
   * Get all alerts for a user
   */
  async getUserAlerts(userId: string): Promise<PriceAlert[]> {
    return Array.from(this.alerts.values()).filter((alert) => alert.userId === userId)
  }

  /**
   * Get a specific alert
   */
  async getAlert(alertId: string): Promise<PriceAlert | null> {
    return this.alerts.get(alertId) || null
  }

  /**
   * Update an alert
   */
  async updateAlert(
    alertId: string,
    updates: Partial<Pick<PriceAlert, 'targetPrice' | 'condition' | 'isActive'>>,
  ): Promise<PriceAlert | null> {
    const alert = this.alerts.get(alertId)
    if (!alert) return null

    // Update alert properties
    if (updates.targetPrice !== undefined) alert.targetPrice = updates.targetPrice
    if (updates.condition !== undefined) alert.condition = updates.condition
    if (updates.isActive !== undefined) {
      alert.isActive = updates.isActive

      // Restart or stop monitoring based on isActive state
      if (updates.isActive) {
        this.monitorAlert(alert)
      } else {
        this.stopMonitoring(alertId)
      }
    }

    this.alerts.set(alertId, alert)
    return alert
  }

  /**
   * Delete an alert
   */
  async deleteAlert(alertId: string): Promise<boolean> {
    this.stopMonitoring(alertId)
    return this.alerts.delete(alertId)
  }

  /**
   * Monitor an alert for triggering conditions
   */
  private monitorAlert(alert: PriceAlert): void {
    // Clear any existing monitoring for this alert
    this.stopMonitoring(alert.id)

    // Check every minute
    const interval = setInterval(async () => {
      if (!alert.isActive) {
        this.stopMonitoring(alert.id)
        return
      }

      const currentPrice = await this.getCurrentPrice(alert.region)
      const shouldTrigger = this.evaluateAlertCondition(alert, currentPrice)

      if (shouldTrigger) {
        await this.triggerAlert(alert, currentPrice)
        this.stopMonitoring(alert.id)
      }
    }, 60000) // Check every minute

    this.monitoringIntervals.set(alert.id, interval)
  }

  /**
   * Stop monitoring an alert
   */
  private stopMonitoring(alertId: string): void {
    const interval = this.monitoringIntervals.get(alertId)
    if (interval) {
      clearInterval(interval)
      this.monitoringIntervals.delete(alertId)
    }
  }

  /**
   * Get current price for a region
   */
  private async getCurrentPrice(region?: string): Promise<number> {
    const marketSummary = marketService.getCurrentMarketSummary()
    return marketSummary.currentPrice
  }

  /**
   * Evaluate if alert condition is met
   */
  private evaluateAlertCondition(alert: PriceAlert, currentPrice: number): boolean {
    switch (alert.condition) {
      case 'above':
        return currentPrice > alert.targetPrice

      case 'below':
        return currentPrice < alert.targetPrice

      case 'crosses':
        return this.checkPriceCrossing(alert, currentPrice)

      default:
        return false
    }
  }

  /**
   * Check if price has crossed the target (for 'crosses' condition)
   */
  private checkPriceCrossing(alert: PriceAlert, currentPrice: number): boolean {
    const previousPrice = this.priceHistory.get(alert.id)

    // Store current price for next check
    this.priceHistory.set(alert.id, currentPrice)

    // Need previous price to detect crossing
    if (previousPrice === undefined) return false

    // Check if price crossed from below to above or vice versa
    return (
      (previousPrice < alert.targetPrice && currentPrice >= alert.targetPrice) ||
      (previousPrice > alert.targetPrice && currentPrice <= alert.targetPrice)
    )
  }

  /**
   * Trigger an alert and send notifications
   */
  private async triggerAlert(alert: PriceAlert, currentPrice: number): Promise<void> {
    alert.triggeredAt = new Date()
    alert.isActive = false
    this.alerts.set(alert.id, alert)

    // Send notifications
    if (alert.notificationMethods.includes('browser')) {
      await this.sendBrowserNotification(alert, currentPrice)
    }

    if (alert.notificationMethods.includes('email')) {
      await this.sendEmailNotification(alert, currentPrice)
    }

    // Log alert trigger
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                    PRICE ALERT TRIGGERED                       ║
╠════════════════════════════════════════════════════════════════╣
║ Alert ID: ${alert.id.padEnd(50)} ║
║ User ID:  ${alert.userId.padEnd(50)} ║
║ Condition: ${alert.condition.toUpperCase().padEnd(49)} ║
║ Target Price: IDR ${alert.targetPrice.toLocaleString().padEnd(40)} ║
║ Current Price: IDR ${currentPrice.toLocaleString().padEnd(38)} ║
║ Time: ${alert.triggeredAt?.toLocaleString().padEnd(49)} ║
╚════════════════════════════════════════════════════════════════╝
    `)
  }

  /**
   * Send browser notification (mock)
   */
  private async sendBrowserNotification(alert: PriceAlert, currentPrice: number): Promise<void> {
    console.log(`📊 Browser Notification: Carbon credit price ${alert.condition} IDR ${alert.targetPrice.toLocaleString()}`)
    console.log(`   Current price: IDR ${currentPrice.toLocaleString()}`)
  }

  /**
   * Send email notification (mock)
   */
  private async sendEmailNotification(alert: PriceAlert, currentPrice: number): Promise<void> {
    console.log(`
📧 EMAIL NOTIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: User ${alert.userId}
Subject: Terravue Price Alert Triggered

Dear Terravue User,

Your price alert has been triggered!

Alert Details:
- Target Price: IDR ${alert.targetPrice.toLocaleString()}
- Condition: ${alert.condition}
- Current Price: IDR ${currentPrice.toLocaleString()}
- Triggered At: ${alert.triggeredAt?.toLocaleString()}
${alert.region ? `- Region: ${alert.region}` : ''}

Visit Terravue to take action on this price movement.

Best regards,
Terravue Team
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `)
  }

  /**
   * Get alert statistics for a user
   */
  async getAlertStatistics(userId: string): Promise<{
    total: number
    active: number
    triggered: number
  }> {
    const userAlerts = Array.from(this.alerts.values()).filter(
      (alert) => alert.userId === userId,
    )

    return {
      total: userAlerts.length,
      active: userAlerts.filter((a) => a.isActive).length,
      triggered: userAlerts.filter((a) => a.triggeredAt !== undefined).length,
    }
  }
}

export const priceAlertService = new PriceAlertService()

