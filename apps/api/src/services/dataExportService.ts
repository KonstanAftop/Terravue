import { DataCategory, DataExportRequest, DataExportResponse, generateId } from '@terravue/shared'
import { inMemoryStore } from '../repositories/inMemoryStore.js'
import { activityTrackingService } from './activityTrackingService.js'

class DataExportService {
  /**
   * Export user data in requested format
   */
  async exportUserData(userId: string, request: DataExportRequest): Promise<DataExportResponse> {
    // Collect data from all requested categories
    const exportData: Record<string, any> = {}

    for (const category of request.categories) {
      exportData[category] = await this.collectCategoryData(userId, category, request.dateRange)
    }

    // Add metadata if requested
    if (request.includeMetadata) {
      exportData.metadata = {
        exportedAt: new Date(),
        exportedBy: userId,
        format: request.format,
        categories: request.categories,
        dateRange: request.dateRange,
      }
    }

    // Format data according to requested format
    let formattedData: string
    let filename: string

    switch (request.format) {
      case 'json':
        formattedData = JSON.stringify(exportData, null, 2)
        filename = `terravue-export-${Date.now()}.json`
        break
      case 'csv':
        formattedData = this.convertToCSV(exportData)
        filename = `terravue-export-${Date.now()}.csv`
        break
      default:
        throw new Error(`Unsupported export format: ${request.format}`)
    }

    return {
      exportId: generateId('export'),
      filename,
      data: formattedData,
      format: request.format,
      exportedAt: new Date(),
    }
  }

  /**
   * Collect data for a specific category
   */
  private async collectCategoryData(
    userId: string,
    category: DataCategory,
    dateRange?: { from: Date; to: Date },
  ): Promise<any[]> {
    switch (category) {
      case 'profile': {
        const user = inMemoryStore.getUser(userId)
        if (!user) return []
        const { password, ...userWithoutPassword } = user
        return [userWithoutPassword]
      }

      case 'settings': {
        const user = inMemoryStore.getUser(userId)
        return user?.settings ? [user.settings] : []
      }

      case 'transactions': {
        let transactions = inMemoryStore
          .getAllTransactions()
          .filter((t) => t.buyerId === userId || t.sellerId === userId)

        if (dateRange) {
          transactions = transactions.filter((t) => {
            const createdAt = new Date(t.createdAt)
            return (
              (!dateRange.from || createdAt >= dateRange.from) &&
              (!dateRange.to || createdAt <= dateRange.to)
            )
          })
        }

        return transactions
      }

      case 'activities': {
        const result = await activityTrackingService.getActivityTimeline(userId, {
          from: dateRange?.from,
          to: dateRange?.to,
          limit: 1000,
        })

        // Flatten timeline to array
        const activities: any[] = []
        Object.values(result.timeline).forEach((dayActivities: any) => {
          activities.push(...dayActivities)
        })

        return activities
      }

      case 'land_parcels': {
        let lands = inMemoryStore.getLandsByOwner(userId)

        if (dateRange) {
          lands = lands.filter((l) => {
            const createdAt = new Date(l.createdAt)
            return (
              (!dateRange.from || createdAt >= dateRange.from) &&
              (!dateRange.to || createdAt <= dateRange.to)
            )
          })
        }

        return lands
      }

      case 'carbon_credits': {
        const lands = inMemoryStore.getLandsByOwner(userId)
        const landIds = lands.map((l) => l.id)

        let credits = inMemoryStore
          .getAllCredits()
          .filter((c) => c.landParcelId && landIds.includes(c.landParcelId))

        if (dateRange) {
          credits = credits.filter((c) => {
            const createdAt = new Date(c.createdAt)
            return (
              (!dateRange.from || createdAt >= dateRange.from) &&
              (!dateRange.to || createdAt <= dateRange.to)
            )
          })
        }

        return credits
      }

      default:
        return []
    }
  }

  /**
   * Convert data to CSV format
   */
  private convertToCSV(data: Record<string, any>): string {
    const csvParts: string[] = []

    // Process each category
    for (const [category, items] of Object.entries(data)) {
      if (category === 'metadata') continue
      if (!Array.isArray(items) || items.length === 0) continue

      // Add category header
      csvParts.push(`\n=== ${category.toUpperCase()} ===\n`)

      // Get all unique keys from all items
      const allKeys = new Set<string>()
      items.forEach((item) => {
        Object.keys(item).forEach((key) => allKeys.add(key))
      })

      const keys = Array.from(allKeys)

      // Add header row
      csvParts.push(keys.join(','))

      // Add data rows
      items.forEach((item) => {
        const row = keys.map((key) => {
          const value = item[key]
          if (value === null || value === undefined) return ''
          if (typeof value === 'object') return JSON.stringify(value).replace(/"/g, '""')
          return String(value).replace(/"/g, '""')
        })
        csvParts.push(row.join(','))
      })
    }

    return csvParts.join('\n')
  }
}

export const dataExportService = new DataExportService()

