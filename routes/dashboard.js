const express = require('express');
const router = express.Router();
const {DateTime} = require('luxon');

const usersModel = require('../database/model/usersModel');
const lotsModel = require('../database/model/lotModel');
const defectsModel = require('../database/model/defectsModel');
const reservationsModel = require('../database/model/reservationsModel');
const notificationRequestsModel = require('../database/model/notificationRequestsModel');

router.get('/', async function(req, res) {
    const {tzOffset} = req.userInfo.user_info;
    try {
        const users = await usersModel.get();
        const lots = await lotsModel.get();
        const reservations = await reservationsModel.getByValidUserId();
        const notficationRequests = await notificationRequestsModel.get();

        const clientDate = DateTime.local()
            .toUTC()
            .startOf('day');
        const fiveDaysAgoDate = clientDate.minus({days: 4}); // 0 based indexing (including today)
        const fiveMonthsAgoDate = clientDate.minus({months: 4});
        const oneMonthAgoDate = clientDate.minus({months: 1});

        const usersRegisteredFiveDaysAgo = await usersModel
            .getByGreaterThanCreatedAt(fiveDaysAgoDate.toSQL());
        const dailyNewUsersArr = [0, 0, 0, 0, 0];
        usersRegisteredFiveDaysAgo.forEach((row) => {
            const createdDate = DateTime.fromISO(new Date(row.created_at)
                .toISOString()).toUTC();
            dailyNewUsersArr[parseInt(createdDate.diff(fiveDaysAgoDate, ['days']).values.days)]++;
        })
        const dailyNewUsers = {
            arr: dailyNewUsersArr,
            labels: ['4 days ago', '3 days ago', '2 days ago', '1 day ago', 'Today'],
        }

        const lotsRegisteredFiveMonthsAgo = await lotsModel
            .getByGreaterThanCreatedAt(fiveMonthsAgoDate.toSQL());
        const monthlyNewLotsArr = [0, 0, 0, 0, 0];
        lotsRegisteredFiveMonthsAgo.forEach((row) => {
            const createdDate = DateTime.fromISO(new Date(row.created_at)
                .toISOString()).toUTC();
            monthlyNewLotsArr[
                parseInt(createdDate.diff(fiveMonthsAgoDate, ['month']).values.month)]++;
        })
        const monthlyNewLots = {
            arr: monthlyNewLotsArr,
            labels: ['4 months ago', '3 months ago', '2 months ago', '1 month ago', 'This month'],
        }

        const reservationsFiveDaysAgo = await reservationsModel
            .getByGreaterThanCreatedAtAndValidUserId(fiveDaysAgoDate.toSQL());
        const dailyNewReservationsArr = [0, 0, 0, 0, 0];
        reservationsFiveDaysAgo.forEach((row) => {
            const createdDate = DateTime.fromISO(new Date(row.created_at)
                .toISOString()).toUTC();
            dailyNewReservationsArr[
                parseInt(createdDate.diff(fiveDaysAgoDate, ['days']).values.days)]++;
        })
        const dailyNewReservations = {
            arr: dailyNewReservationsArr,
            labels: ['4 days ago', '3 days ago', '2 days ago', '1 day ago', 'Today'],
        }

        const notificationRequestsFiveDaysAgo = await notificationRequestsModel
            .getByGreaterThanCreatedAt(fiveDaysAgoDate.toSQL());
        const dailyNewNotificationRequestsArr = [0, 0, 0, 0, 0];
        notificationRequestsFiveDaysAgo.forEach((row) => {
            const createdDate = DateTime.fromISO(new Date(row.created_at)
                .toISOString()).toUTC();
            dailyNewNotificationRequestsArr[
                parseInt(createdDate.diff(fiveDaysAgoDate, ['days']).values.days)]++;
        });
        const dailyNewNotificationRequests = {
            arr: dailyNewNotificationRequestsArr,
            labels: ['4 days ago', '3 days ago', '2 days ago', '1 day ago', 'Today'],
        }

        const dateDiff = parseInt(clientDate.diff(oneMonthAgoDate, ['days']).values.days);
        const monthLabels = Array(dateDiff).fill(0).map((elem, index) => {
            const newDate = clientDate;
            return newDate.plus({minutes: tzOffset})
                .minus({days: index}).toISODate();
        }).reverse();

        const revenueOneMonthAgo = await reservationsModel
            .getByGreaterThanCreatedAtAndValidUserIdAndPaid(
                oneMonthAgoDate.toSQL());
        const dailyRevenueArr = Array(dateDiff).fill(0);
        let totalMonthRevenue = 0;
        revenueOneMonthAgo.forEach((row) => {
            const createdDate = DateTime.fromISO(new Date(row.created_at)
                .toISOString()).toUTC();
            dailyRevenueArr[parseInt(createdDate.diff(oneMonthAgoDate, ['days']).values.days)] +=
                row.total_price
            totalMonthRevenue += row.total_price
        });

        const notificationRequestsOneMonthAgo = await notificationRequestsModel
            .getByGreaterThanCreatedAt(
                oneMonthAgoDate.toSQL());
        const montlyNotificationRequestsArr = Array(dateDiff).fill(0);
        let totalNotficationRequests = 0;
        notificationRequestsOneMonthAgo.forEach((row) => {
            const createdDate = DateTime.fromISO(new Date(row.created_at)
                .toISOString()).toUTC();
            montlyNotificationRequestsArr[parseInt(createdDate.diff(oneMonthAgoDate, ['days']).values.days)]++
            totalNotficationRequests++;
        });

        const reservationsOneMonthAgo = await reservationsModel
            .getByGreaterThanCreatedAtAndValidUserId(
                oneMonthAgoDate.toSQL());
        const dailyReservationsRequestsArr = Array(dateDiff).fill(0);
        let totalReservations = 0;
        reservationsOneMonthAgo.forEach((row) => {
            const createdDate = DateTime.fromISO(new Date(row.created_at)
                .toISOString()).toUTC();
            dailyReservationsRequestsArr[parseInt(createdDate.diff(oneMonthAgoDate, ['days']).values.days)]++
            totalReservations++;
        });

        const toggleData = {
            revenue: {
                label: 'Revenue',
                data: dailyRevenueArr,
            },
            notificationRequests: {
                label: 'Notification Requests',
                data: montlyNotificationRequestsArr,
            },
            reservations: {
                label: 'Reservations',
                data: dailyReservationsRequestsArr,
            },
        }

        const mainToggleLine = {
            labels: monthLabels,
            datasets: [
                {
                    label: toggleData['revenue'].label,
                    data: toggleData['revenue'].data,
                    lineTension: 0,
                    fill: 0,
                },
            ],
        };

        const mainToggleLineHeader = [
            {
                title: 'Revenue',
                metric: 'revenue',
                value: '$' + totalMonthRevenue,
            },
            {
                title: 'Notification Requests',
                metric: 'notificationRequests',
                value: totalNotficationRequests,
            },
            {
                title: 'Reservations',
                metric: 'reservations',
                value: totalReservations,
            },
        ];

        return res.render('page/dashboard/dashboard', {
            title: 'Overview',
            numOfUsers: users.length,
            numOfLots: lots.length,
            numOfReservations: reservations.length,
            numOfNotficationRequests: notficationRequests.length,
            dailyNewUsers,
            monthlyNewLots,
            dailyNewReservations,
            dailyNewNotificationRequests,
            mainToggleLine,
            mainToggleLineHeader,
            toggleData,
        });
    } catch (err) {

    }
});
module.exports = router;
