import { Request, Response } from "express"
import Entry from "../models/Entry"
import { DateTime } from "luxon"

export const getEntriesByMonth = async (req: Request, res: Response) => {
  const { timezone, month, year } = req.query
  const timezoneStr = typeof timezone === "string" ? timezone : "UTC"

  const now = DateTime.now().setZone(timezoneStr)
  const currentYear = now.year
  const currentMonth = now.month

  const yearNum = year ? parseInt(year as string) : currentYear
  const monthNum = month ? parseInt(month as string) : currentMonth

  let datePattern: string
  if (year && month) {
    datePattern = `${yearNum}-${String(monthNum).padStart(2, "0")}`
  } else if (year) {
    datePattern = `${yearNum}`
  } else if (month) {
    datePattern = `${currentYear}-${String(monthNum).padStart(2, "0")}`
  } else {
    datePattern = ""
  }

  const groupedEntries = await Entry.aggregate([
    {
      $addFields: {
        dateStr: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: timezoneStr }
        }
      }
    },
    ...(datePattern ? [{
      $match: {
        dateStr: { $regex: `^${datePattern}` }
      }
    }] : []),
    {
      $group: {
        _id: "$dateStr",
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: -1 }
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        count: 1
      }
    }
  ])

  res.json({
    month: monthNum,
    year: yearNum,
    timezone: timezoneStr,
    days: groupedEntries,
  })
}

export const getEntriesByDay = async (req: Request, res: Response) => {
  const { date, timezone } = req.query
  const timezoneStr = typeof timezone === "string" ? timezone : "UTC"

  if (!date || typeof date !== "string") {
    return res.status(400).json({ error: "Date parameter (YYYY-MM-DD) is required" })
  }

  const startOfDay = DateTime.fromISO(date, { zone: timezoneStr }).startOf("day")
  const endOfDay = startOfDay.plus({ days: 1 })

  const entries = await Entry.find({
    createdAt: {
      $gte: startOfDay.toJSDate(),
      $lt: endOfDay.toJSDate(),
    },
  }).sort({ createdAt: -1 })

  res.json({
    date,
    timezone,
    range: {
      start: startOfDay.toISO(),
      end: endOfDay.toISO(),
    },
    count: entries.length,
    entries,
  })
}

export const createEntry = async (req: Request, res: Response) => {
  const entry = await Entry.create(req.body)
  res.status(201).json(entry)
}

export const deleteEntry = async (req: Request, res: Response) => {
  await Entry.findByIdAndDelete(req.params.id)
  res.status(204).send()
}
