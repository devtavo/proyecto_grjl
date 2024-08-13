from docxtpl import DocxTemplate

doc = DocxTemplate("output/template/Merge Macro Red Highlighted_2.docx")
#Objecto context para todos los textos
context = {
    "companyNameP1": "CONVERGINT TECHNOLOGIES",
    "phoneP4": "847-585-8738",
    "emailP4": "alison.kerbis@convergint.com",
    "promotions1P38": {
        "table": [
            {
                "year": "2021",
                "data": [
                    {
                        "jobGroup": 1.1,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },
                    {
                        "jobGroup": 1.1,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },
                    {
                        "jobGroup": 1.1,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },
                    {
                        "jobGroup": 1.1,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },
{
                        "jobGroup": 1.1,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },
{
                        "jobGroup": 1.1,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },
                ]
            }
        ]
    },
    "yearP1": "2022",
    "imgP1": "imm",
    "corporateP1": "Corporate",
    "addressP1": "1 Commerce Drive, Schaumburg, IL 60173",
    "yearFootP1": "2016-2023",
    "companyNameP4": "Convergint Technologies LLC",
    "addressP4": "1 Commerce Drive, Schaumburg, IL 60173",
    "aapDateP4": "January 1, 2022, through December 31, 2022",
    "corporateSeniorManagerP4": "Ken Lochiatto, CEO",
    "corporateEeoOfficerP4": "Alison Kerbis, Benefits Manager",
    "naicsP4": "561621",
    "eeoNoP4": "AV05446",
    "companyStoryP5": "Convergint is a $2.0 billion global, industry-leading systems integrator that designs, installs, and services electronic security, cybersecurity, fire and life safety, building automation, and audio-visual systems. Our top priority is service in every way — service to customers, colleagues, and community. Convergint’s unique and empowered culture, guided by our Values and Beliefs, helps us stay accountable to our mission, and our number one objective: to be our customers’ best service provider. Listed as the #1 systems integrator in SDM Magazine’s Top Systems Integrators Report for the past 5 years, Convergint leads with over 9,000 colleagues and more than 185 locations worldwide. Convergint’s Inclusion & Diversity Council serves as a working advisory body to Convergint leadership. Their purpose is to ensure diversity, equality, and accessibility are considered in strategic management initiatives, to assist in the alignment of strategic planning with I&D objectives, and to develop and support initiatives aimed at promoting inclusion.  The Convergint I&D Council in the U.S. hosts multiple I&D Affinity Groups with hundreds of active participants across the U.S.",
    "companyNameP6": "Convergint Technologies LLC",
    "underutilization80P10": {
            "table": [
                {
                    "year": "2021",
                    "data": [
                        {
                            "jobGroup": 1.2,
                            "protectedGroup": "BLACK",
                            "shortFall": "",
                            "totalIncumbeng": "",
                            "applicants": "",
                            "hires": ""
                        },
                        {
                            "jobGroup": 1.2,
                            "protectedGroup": "BLACK",
                            "shortFall": "",
                            "totalIncumbeng": "",
                            "applicants": "",
                            "hires": ""
                        },
                        {
                            "jobGroup": 1.2,
                            "protectedGroup": "BLACK",
                            "shortFall": "",
                            "totalIncumbeng": "",
                            "applicants": "",
                            "hires": ""
                        },
                        {
                            "jobGroup": 1.2,
                            "protectedGroup": "BLACK",
                            "shortFall": "",
                            "totalIncumbeng": "",
                            "applicants": "",
                            "hires": ""
                        },
                        {
                            "jobGroup": 1.2,
                            "protectedGroup": "BLACK",
                            "shortFall": "",
                            "totalIncumbeng": "",
                            "applicants": "",
                            "hires": ""
                        },
                        {
                            "jobGroup": 1.2,
                            "protectedGroup": "BLACK",
                            "shortFall": "",
                            "totalIncumbeng": "",
                            "applicants": "",
                            "hires": ""
                        },
                    ]
                }
            ]
    },
    "underutilizationDisabledVeteransP10": "The analysis was reviewed based on Individuals with Disabilities (IWDs) and Veterans and the following summarizes those findings.",
    "currently1P10": "Currently there are 28 employees at this facility who self-identified as individuals with disabilities out of 1548 total employees at this location or 1.8%.  The company uses the federal benchmark of 7%.  Accordingly, the company will focus recruitment efforts on finding qualified individuals with disabilities to apply for positions this plan year.",
    "currently2P10": "Currently there are 212 employees who self-identified as Veterans out of 1548 total employees at this location or 13.7%.  The company uses the federal benchmark of 5.7%.  Accordingly, the company has met the goal for Vets.  This is not a potential problem area.",
    "foregoingP10": " continues to have goals in all job groups for IWDs.  A review of the personnel activity data indicates there were no IWD applicants for 1.1 Executives, 65 for 1.2 Officials & Managers, 130 for 2 Professionals, 115 for 3 Technicians, 53 for 4 Sales, 219 for Administrative, 19 for 6 Crafts and 25 for 8 Laborers. Of those who applied, 1 IWD was hired into the 2 Professionals, 11 in 3 Technicians, 1 in 4 Sales, 3 in 5 Administrative, 2 in 6 Crafts and 1 in 8 Laborers.  There were no IWD promotions or terminations last year.  Though much progress has been made, these hires were still not enough to meet the benchmark goals for the current year and the company will continue its outreach efforts to meet the goals this year.",
    "veteransCompanyP10": "has met the goals in 6 job groups.  However, there are still individual job groups with goals in 1.1 Executives and 5 Administrative.  A review of personnel data revealed there were no Vets who applied last year for 1.1 Executive positions, 71 Vets applied for 1.2 Office Clerical, 124 who applied for 2 Professionals, 175 who applied for 3 Technicians, 43 who applied for 4 Sales, 96 who applied for 5 Administrative jobs, 27 who applied for 6 Crafts and 34 who applied for 8 Laborers.  Of those, 9 of the Vets were hired into 1.2, 14 into 2 Professionals, 44 in 3 Technicians, 8 in 4 Sales, 3 in 5 Administrative positions, 7 in 6 Crafts and 1 in 8 Laborers.  There were also 3 Veteran promotions into 1.2, 2 into 2 Professionals, 6 into 3 Technicians 2 into 4 Sales and 1 in 5 Administrative, as well as, 5 terminations in 1.2 Office Clerical, 6 terms in 2 Professionals, 8 in 3 Technicians, 3 in 4 Sales, 1 in 5 Administrative and 1 in 6 Crafts leaving the disparities for only Executives and Administrative. The company will continue to take good faith efforts for the current plan year by reaching out to additional disability and veteran organizations according to our action-oriented programs, conducting more targeted disability and vet recruitment efforts when possible, and continuing to analyze the employment data to monitor where efforts are making progress in an effort to meet the goals going forward.",
    "underutilizationAnalisysTwoP11": {
            "table": [
                {
                    "year": "2021",
                    "data": [
                        {
                            "jobGroup": 1.2,
                            "protectedStatus": "BLACK",
                            "over2Sd": "",
                            "applicants": "",
                            "hires": "",
                            "addEfforts": ""
                        },
                        {
                            "jobGroup": 1.2,
                            "protectedStatus": "BLACK",
                            "over2Sd": "",
                            "applicants": "",
                            "hires": "",
                            "addEfforts": ""
                        },
                        {
                            "jobGroup": 1.2,
                            "protectedStatus": "BLACK",
                            "over2Sd": "",
                            "applicants": "",
                            "hires": "",
                            "addEfforts": ""
                        },
                        {
                            "jobGroup": 1.2,
                            "protectedStatus": "BLACK",
                            "over2Sd": "",
                            "applicants": "",
                            "hires": "",
                            "addEfforts": ""
                        },
                        {
                            "jobGroup": 1.2,
                            "protectedStatus": "BLACK",
                            "over2Sd": "",
                            "applicants": "",
                            "hires": "",
                            "addEfforts": ""
                        },
                    ]
                }
            ]
    },
    "adverseImpactP11": "the comparison of hires to applicants, promotions and terminations to incumbents was conducted as required and the results indicated the following:",
    "hiresP11": {
        "table": [
            {
                "year": "2021",
                "data": [
                    {
                        "jobGroup": 1.1,
                        "disabilityStatus": 2,
                        "veteranStatus": 1,
                        "totalNumberEmployes": 33,
                        "percentageDisabled": 6.06,
                        "percentageVeteran": 3.03
                    },
                    {
                        "jobGroup": 1.2,
                        "disabilityStatus": 3,
                        "veteranStatus": 26,
                        "totalNumberEmployes": 192,
                        "percentageDisabled": 1.56,
                        "percentageVeteran": 13.54
                    },
                    {
                        "jobGroup": 2,
                        "disabilityStatus": 1,
                        "veteranStatus": 45,
                        "totalNumberEmployes": 280,
                        "percentageDisabled": 0.36,
                        "percentageVeteran": 16.07
                    },
                    {
                        "jobGroup": 3,
                        "disabilityStatus": 11,
                        "veteranStatus": 89,
                        "totalNumberEmployes": 549,
                        "percentageDisabled": 2,
                        "percentageVeteran": 16.21
                    },
                    {
                        "jobGroup": 4,
                        "disabilityStatus": 5,
                        "veteranStatus": 26,
                        "totalNumberEmployes": 163,
                        "percentageDisabled": 3.07,
                        "percentageVeteran": 15.95
                    },
                    {
                        "jobGroup": 5,
                        "disabilityStatus": 4,
                        "veteranStatus": 10,
                        "totalNumberEmployes": 230,
                        "percentageDisabled": 1.74,
                        "percentageVeteran": 4.35
                    },
                    {
                        "jobGroup": 6,
                        "disabilityStatus": 1,
                        "veteranStatus": 12,
                        "totalNumberEmployes": 83,
                        "percentageDisabled": 1.2,
                        "percentageVeteran": 14.46
                    },
                    {
                        "jobGroup": 8,
                        "disabilityStatus": 1,
                        "veteranStatus": 3,
                        "totalNumberEmployes": 18,
                        "percentageDisabled": 5.56,
                        "percentageVeteran": 16.67
                    }
                ]
            }
        ]
    },
    "comparison1P11": "identified /adverse /impact against minorities and IWDs in the 1.2 First/Mid-level Officials and Managers job group. Here there were 752 non-minorities with 55 hires compared to 270 minority applicant and 10 hires.  This gave 7 less minority hires than expected.  For IWDs there were 957 non-IWD applicants with 65 hires compared to 65 IWD applicants and no hires.  This gave 4 less IWD hires than expected.",
    "comparison2P11": "In the 2 Professionals group there is adverse impact for minorities and Asians with 3.26 and 2.47 standard deviations respectively where there were 1312 non-minority applicants with 89 hires compared to 678 minority applicants with 22 hires, giving 15 less than expected. Out of 204 Asian applicants 5 were hired, compared to 1786 non-Asians with 106 hires. This gave 6 less Asian hires than expected. IWDs showed 1 hire out of 111 total, 6 less than expected giving 2.47 standard deviations.",
    "hiresCont1P11": "There was also adverse impact against minorities, females and Asians in the 3 Technicians job group where there were 1160 non-minority applicants with 184 hires compared to 620 minority applicants with 68 hires. This is 15 less than the expected hires for that group. For Females the analysis showed 10 out of 248 total hires, 25 less than the expected female hires. For Asians there were 5 hires out of 99 applicants compared to 247 non-Asian hires with 1681 applicants, creating a 2.67 standard deviations.",
    "hiresCont2P11": "Finally, there was adverse impact against minorities and IWDs in the 5 Administrative job group.  Here there were 1653 non-minority applicants with 84 hires compared to 1272 minority applicants with 37 hires, or 15 less than the expected 52 minority hires.  For IWDs that analysis shows 3 hires out of 219 applicants which is 6 less than the expected 9",
    "promotion1P11": {
        "table": [
            {
                "year": "2021",
                "data": [
                    {
                        "jobGroup": 1.1,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },
                    {
                        "jobGroup": 1.1,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },{
                        "jobGroup": 1.1,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },{
                        "jobGroup": 1.1,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },{
                        "jobGroup": 1.1,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },
                ]
            }
        ]
    },
    "promotions2P11": "In the 3 Technicians job group there is an adverse impact for Hispanics with 2.49 standard deviations where there were 353 non-minority incumbents with 54 promotions and 35 minorities with none. This gave 4 less Hispanic promotions than expected.",
    "terminations1P11": {
        "table": [
            {
                "year": "2021",
                "data": [
                    {
                        "jobGroup": 1.1,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },
                    {
                        "jobGroup": 1.1,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },{
                        "jobGroup": 1.1,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },{
                        "jobGroup": 1.1,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },{
                        "jobGroup": 1.1,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },
                ]
            }
        ]
    },
    "terminations2P11": "In the 1.2 First/Mid-Level Managers and Officials there is adverse impact for veterans with 2.89 standard deviations where there were 112 non-vet employees with 14 terminations, compared to 11 veteran employees with 5 terminations.  This gave 4 more veteran terminations than expected. ",
    "terminations3P11": "In the 3 Technicians job group there is adverse impact for minorities, Asians and Hispanics where there were 319 non-minority incumbents with 57 terminations as opposed to 69 minority incumbents with 28 terminated. This gave 13 more minority terminations than expected. For Asians there were 386 non-Asian incumbents with 2 terminations compared to having 2 Asians at the beginning of the year with 3 Asian terminations throughout the year.  This gave 3 more Asian terminations than expected giving 4.39 standard deviations. For Hispanics there were 35 Hispanic incumbents with 13 terminations, compared to 353 non-Hispanics with 67 terminations.",
    "terminations4P11": "Job group 4 Sales workers shows adverse impact for minorities, females, Asians and Hispanics. There were 11 Minority incumbents with 5 terminations compared to 105 non-minorities with 9 terminations, giving 4 more minority terminations than expected. Females show 3 more terminations than expected with 14 incumbents and 4 terminations giving 2.02 standard deviations.  For Asians, out of 116 incumbents, 115 were non-Asian with 13 terminations. Compared to 1 Asian incumbent who terminated. Hispanics show 4 incumbents with 3 terminations as opposed to the 112 non-Hispanics with 11 terminations.",
    "terminations5P11": "Finally, there was adverse impact for females in the 8 Laborers job group where there were 13 male employees with 0 terminations compared to 1 female employee that terminated giving 3.74 standard deviations or 1 more female termination than expected.  ",
    "yearSummarizesP12": "2012-2022",
    "priorYearSummarizesP12": "The table below identifies that both of last year’s goals have been met and there are no new goals.  The Company will make good faith efforts to maintain the current diversity this plan year.",
     "table1P10": {
        "table": [
            {
                "year": "2021",
                "data": [
                    {
                        "jobGroup": 1.1,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },
                    {
                        "jobGroup": 2,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },
                    {
                        "jobGroup": 3,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },
                    {
                        "jobGroup": 4,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },
                ]
            }
        ]
    },
    "table1PriorP12": {
        "table": [
            {
                "year": "2021",
                "data": [
                    {
                        "jobGroup": "3 TECHNICIANS",
                        "protectedGroup": "ASIANS",
                        "goalMet": "YES",
                        "additionalGoal": "NONE"
                    },
                    {
                        "jobGroup": "8 LABORERS",
                        "protectedGroup": "FEMALES",
                        "goalMet": "YES",
                        "additionalGoal": "NONE"
                    }
                ]
            }
        ]
    },
    "title1PriorP12": "PRIOR YEAR GOALS",
    "table2PriorP12": {
        "table": [
            {
                "year": "2020",
                "data": [
                    {
                        "jobGroup": "3 TECHNICIANS",
                        "protectedGroup": "FEMALESASIANS",
                        "goalMet": "YES>",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "6 CRAFTS",
                        "protectedGroup": "FEMALES",
                        "goalMet": "YES",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "8 LABORERS",
                        "protectedGroup": "",
                        "goalMet": "",
                        "additionalGoal": "FEMALES"
                    }
                ]
            }
        ]
    },
    "table3PriorP12": {
        "table": [
            {
                "year": "2019",
                "data": [
                    {
                        "jobGroup": "2 PROFESIONALS",
                        "protectedGroup": "FEMALES",
                        "goalMet": "YES",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "3 TECHNICIANS",
                        "protectedGroup": "FEMALES",
                        "goalMet": "NO",
                        "additionalGoal": "ASIANS"
                    },
                    {
                        "jobGroup": "6 CRAFTS",
                        "protectedGroup": "",
                        "goalMet": "",
                        "additionalGoal": "FEMALES"
                    }
                ]
            }
        ]
    },
    "table4PriorP12": {
        "table": [
            {
                "year": "2018",
                "data": [
                    {
                        "jobGroup": "1.1 EXECUTIVES",
                        "protectedGroup": "FEMALESMINORITIES",
                        "goalMet": "",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "1.2 FIRST/MID-LEVEL",
                        "protectedGroup": "BLACKS",
                        "goalMet": "YES",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "2 PROFESSIONALS",
                        "protectedGroup": "",
                        "goalMet": "",
                        "additionalGoal": "FEMALES"
                    },
                    {
                        "jobGroup": "3 TECHNICIANS",
                        "protectedGroup": "FEMALES",
                        "goalMet": "NO",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "4 SALES",
                        "protectedGroup": "FEMALES",
                        "goalMet": "YES",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "8 LABORERS & HELPERS",
                        "protectedGroup": "",
                        "goalMet": "",
                        "additionalGoal": ""
                    }
                ]
            }
        ]
    },
    "title2PriorP12": "PRIOR YEAR GOALS CONT.",
    "table5PriorP12": {
        "table": [
            {
                "year": "2017",
                "data": [
                    {
                        "jobGroup": "1.1 EXECUTES",
                        "protectedGroup": "FEMALESMINORITIES",
                        "goalMet": "YESYES",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "1.2 FIRST/MID-LEVEL",
                        "protectedGroup": "BLACKS",
                        "goalMet": "NO",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "3 TECHNICIANS",
                        "protectedGroup": "FEMALES",
                        "goalMet": "NO",
                        "additionalGoal": "ASIANS"
                    },
                    {
                        "jobGroup": "4 SALES",
                        "protectedGroup": "FEMALES",
                        "goalMet": "NO",
                        "additionalGoal": "HISPANICS"
                    },
                    {
                        "jobGroup": "8 LABORERS & HELPERS",
                        "protectedGroup": "",
                        "goalMet": "",
                        "additionalGoal": "FEMALES"
                    }
                ]
            }
        ]
    },
    "table6PriorP12": {
        "table": [
            {
                "year": "2016",
                "data": [
                    {
                        "jobGroup": "1.1 EXECUTIVES",
                        "protectedGroup": "FEMALESMINORITIES",
                        "goalMet": "NONO",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "1.2 FIRST / MID-LEVEL",
                        "protectedGroup": "",
                        "goalMet": "",
                        "additionalGoal": "BLACKS"
                    },
                    {
                        "jobGroup": "3 TECHNICIANS",
                        "protectedGroup": "",
                        "goalMet": "",
                        "additionalGoal": "FEMALES"
                    },
                    {
                        "jobGroup": "4 SALES",
                        "protectedGroup": "FEMALES",
                        "goalMet": "NO",
                        "additionalGoal": ""
                    }
                ]
            }
        ]
    },
    "table7PriorP12": {
        "table": [
            {
                "year": "2015",
                "data": [
                    {
                        "jobGroup": "1.1 EXECUTIVES",
                        "protectedGroup": "FEMALESMINORITIES",
                        "goalMet": "NONO",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "4 SALES",
                        "protectedGroup": "FEMALES",
                        "goalMet": "NO",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "5 ADMINISTRATIVE SUPPORT",
                        "protectedGroup": "ASIANS",
                        "goalMet": "YES",
                        "additionalGoal": ""
                    }
                ]
            }
        ]
    },
    "table8PriorP13": {
        "table": [
            {
                "year": "2014",
                "data": [
                    {
                        "jobGroup": "1.1 EXECUTIVES",
                        "protectedGroup": "",
                        "goalMet": "",
                        "additionalGoal": "FEMALESMINORITIES"
                    },
                    {
                        "jobGroup": "1.2 FIRST / MID LEVEL MANAGERS",
                        "protectedGroup": "MINORITIESHISPANICS",
                        "goalMet": "YESYES",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "2 PROFESIONALS",
                        "protectedGroup": "BLACKS",
                        "goalMet": "YES",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "3 TECHNICIANS",
                        "protectedGroup": "FEMALESASIANS",
                        "goalMet": "YESYES",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "4 SALES WORKERS",
                        "protectedGroup": "FEMALESBLACKS",
                        "goalMet": "NOYES",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "5 ADMINISTRATIVE SUPPORT",
                        "protectedGroup": "ASIANS",
                        "goalMet": "NO",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "6 CRAFTS",
                        "protectedGroup": "FEMALES",
                        "goalMet": "YES",
                        "additionalGoal": ""
                    }
                ]
            }
        ]
    },
    "title3PriorP13": "PRIOR YEAR GOALS CONT.",
    "table9PriorP13": {
        "table": [
            {
                "year": "2013",
                "data": [
                    {
                        "jobGroup": "1.1 EXECUTIVESMANAGERS",
                        "protectedGroup": "FEMALESMINORITIES",
                        "goalMet": "YESYES",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "1.2 FIRST / MID LEVEL MANAGERS",
                        "protectedGroup": "MINORITIES",
                        "goalMet": "NO",
                        "additionalGoal": "HISPANICS"
                    },
                    {
                        "jobGroup": "2 PROFESIONALS",
                        "protectedGroup": "BLACKS",
                        "goalMet": "NO",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "3 TECHNICIANS",
                        "protectedGroup": "FEMALESMINORITIESHISPANICSASIANS",
                        "goalMet": "NOYESYESNO",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "4 SALES WORKERS",
                        "protectedGroup": "FEMALES",
                        "goalMet": "NO",
                        "additionalGoal": "BLACKS"
                    },
                    {
                        "jobGroup": "5 ADMINISTRATIVE SUPPORT",
                        "protectedGroup": "MINORITIESBLACKSHISPANICSASIANS",
                        "goalMet": "NO",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "6 CRAFTS",
                        "protectedGroup": "",
                        "goalMet": "",
                        "additionalGoal": "FEMALES"
                    }
                ]
            }
        ]
    },
    "table10PriorP13": {
        "table": [
            {
                "year": "2012",
                "data": [
                    {
                        "jobGroup": "1.1 EXECUTIVIES",
                        "protectedGroup": "FEMALESMINORITIES",
                        "goalMet": "NONO",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "1.2 FIRST/MID-LEVEL MANAGERS",
                        "protectedGroup": "FEMALESMINORITIESBLACKSHISPANICSASIANS",
                        "goalMet": "NOYESYESYESYES",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "2 PROFESIONALS",
                        "protectedGroup": "ASIANS",
                        "goalMet": "YES",
                        "additionalGoal": "BLACKS"
                    },
                    {
                        "jobGroup": "3 TECHNICIANS",
                        "protectedGroup": "FEMALESMINORITIESBLACKSHISPANICSASIANS",
                        "goalMet": "NONONONONO",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "4 SALES WORKERS",
                        "protectedGroup": "FEMALESMINORITIESASIANS",
                        "goalMet": "NOYESYES",
                        "additionalGoal": "BLACKS"
                    },
                    {
                        "jobGroup": "6 CRAFT WORKERS SUPPORT",
                        "protectedGroup": "BLACKS",
                        "goalMet": "NO",
                        "additionalGoal": "FEMALES"
                    },
                    {
                        "jobGroup": "7 OPERATIVES",
                        "protectedGroup": "",
                        "goalMet": "",
                        "additionalGoal": "FEMALESMINORITIES"
                    }
                ]
            }
        ]
    },
    "table1JobP14": {
        "table": [
            {
                "year": "2021",
                "data": [
                    {
                        "department": "ADMINISTRATION",
                        "underrepresentation": "",
                        "concentration": "15.41 SD FEMALES 2.43 SD MINORITIES",
                        "sizeOfDept": ""
                    },
                    {
                        "department": "SALES",
                        "underrepresentation": "8.46  FEMALES2.3 SD MINORITIES",
                        "concentration": "",
                        "sizeOfDept": "28 FEMALES OUT OF 217 TOTAL25 MINORITIES OUT OF 217 TOTAL"
                    },
                    {
                        "department": "OPERATIONS",
                        "underrepresentation": "2.97 SD FEMALES",
                        "concentration": "",
                        "sizeOfDept": "91 FEMALES OUT OF 929 TOTAL"
                    }
                ]
            }
        ]
    },
    "analysisJobP14": "3 Departments listed above had over 30 incumbents and over 2 standard deviations. Accordingly, managers in these Departments will be informed of the disparities and the company will continue to monitor the selection process to ensure equity in all personnel decisions.",
    "dateP33": "January 1, 2022 through December 31, 2022",
    "companyP33": "Convergint Technologies LLC",
    "ceoCompanyP33": "Ken Lochiatto, CEO",
    "underutilizationAnalysis80P37": "There was no underutilization identified in any job group applying the 80% Whole Person Rule.  This is not a potential problem area.",
    "underutilizationDisabledVeteransP37": "The analysis was reviewed based on Individuals with Disabilities (IWDs) and Veterans and the following summarizes those findings.",
    "currently1P37": "Currently there are 28 employees at this facility who self-identified as individuals with disabilities out of 1548 total employees at this location or 1.8%.  The company uses the federal benchmark of 7%.  Accordingly, the company will focus recruitment efforts on finding qualified individuals with disabilities to apply for positions this plan year.",
    "currently2P37": "Currently there are 212 employees who self-identified as Veterans out of 1548 total employees at this location or 13.7%.  The company uses the federal benchmark of 5.7%.  Accordingly, the company has met the goal for Vets.  This is not a potential problem area.",
    "foregoingP37": "The foregoing shows the goals for the 2022 plan year for individuals with disabilities and veterans by job group.  The company continues to have goals in all job groups for IWDs.  A review of the personnel activity data indicates there were no IWD applicants for 1.1 Executives, 65 for 1.2 Officials & Managers, 130 for 2 Professionals, 115 for 3 Technicians, 53 for 4 Sales, 219 for Administrative, 19 for 6 Crafts and 25 for 8 Laborers. Of those who applied, 1 IWD was hired into the 2 Professionals, 11 in 3 Technicians, 1 in 4 Sales, 3 in 5 Administrative, 2 in 6 Crafts and 1 in 8 Laborers.  There were no IWD promotions or terminations last year.  Though much progress has been made, these hires were still not enough to meet the benchmark goals for the current year and the company will continue its outreach efforts to meet the goals this year. ",
    "veteransCompanyP37": "For Veterans the company has met the goals in 6 job groups.  However, there are still individual job groups with goals in 1.1 Executives and 5 Administrative.  A review of personnel data revealed there were no Vets who applied last year for 1.1 Executive positions, 71 Vets applied for 1.2 Office Clerical, 124 who applied for 2 Professionals, 175 who applied for 3 Technicians, 43 who applied for 4 Sales, 96 who applied for 5 Administrative jobs, 27 who applied for 6 Crafts and 34 who applied for 8 Laborers.  Of those, 9 of the Vets were hired into 1.2, 14 into 2 Professionals, 44 in 3 Technicians, 8 in 4 Sales, 3 in 5 Administrative positions, 7 in 6 Crafts and 1 in 8 Laborers.  There were also 3 Veteran promotions into 1.2, 2 into 2 Professionals, 6 into 3 Technicians 2 into 4 Sales and 1 in 5 Administrative, as well as, 5 terminations in 1.2 Office Clerical, 6 terms in 2 Professionals, 8 in 3 Technicians, 3 in 4 Sales, 1 in 5 Administrative and 1 in 6 Crafts leaving the disparities for only Executives and Administrative. The company will continue to take good faith efforts for the current plan year by reaching out to additional disability and veteran organizations according to our action-oriented programs, conducting more targeted disability and vet recruitment efforts when possible, and continuing to analyze the employment data to monitor where efforts are making progress in an effort to meet the goals going forward.",
    "underutilizationTwoP37": "There was no underutilization identified in any job group against any protected group applying the more stringent two standard deviations test. This is not a potential problem area.",
    "adverseImpactP37": "The comparison of hires to applicants, promotions and terminations to incumbents was conducted as required and the results indicated the following:",
    "hiresP37": {
        "table": [
            {
                "year": "2021",
                "data": [
                    {
                        "jobGroup": 1.1,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },
                    {
                        "jobGroup": 2,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },
                    {
                        "jobGroup": 3,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },
                    {
                        "jobGroup": 4,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },
                ]
            }
        ]
    },
    "comparison1P37": "A comparison of applicants to hires for each job group identified adverse impact against minorities and IWDs in the 1.2 First/Mid-level Officials and Managers job group. Here there were 752 non-minorities with 55 hires compared to 270 minority applicant and 10 hires.  This gave 7 less minority hires than expected.  For IWDs there were 957 non-IWD applicants with 65 hires compared to 65 IWD applicants and no hires.  This gave 4 less IWD hires than expected. ",
    "comparison2P37": "In the 2 Professionals group there is adverse impact for minorities and Asians with 3.26 and 2.47 standard deviations respectively where there were 1312 non-minority applicants with 89 hires compared to 678 minority applicants with 22 hires, giving 15 less than expected. Out of 204 Asian applicants 5 were hired, compared to 1786 non-Asians with 106 hires. This gave 6 less Asian hires than expected. IWDs showed 1 hire out of 111 total, 6 less than expected giving 2.47 standard deviations. ",
    "comparison3P38": "There was also adverse impact against minorities, females and Asians in the 3 Technicians job group where there were 1160 non-minority applicants with 184 hires compared to 620 minority applicants with 68 hires. This is 15 less than the expected hires for that group. For Females the analysis showed 10 out of 248 total hires, 25 less than the expected female hires. For Asians there were 5 hires out of 99 applicants compared to 247 non-Asian hires with 1681 applicants, creating a 2.67 standard deviations.  ",
    "comparison4P38": "Finally, there was adverse impact against minorities and IWDs in the 5 Administrative job group.  Here there were 1653 non-minority applicants with 84 hires compared to 1272 minority applicants with 37 hires, or 15 less than the expected 52 minority hires.  For IWDs that analysis shows 3 hires out of 219 applicants which is 6 less than the expected 9.",
    "promotions2P38": "In the 3 Technicians job group there is an adverse impact for Hispanics with 2.49 standard deviations where there were 353 non-minority incumbents with 54 promotions and 35 minorities with none. This gave 4 less Hispanic promotions than expected.",
    "terminations1P38": {
        "table": [
            {
                "year": "2021",
                "data": [
                    {
                        "jobGroup": 1.1,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },
                    {
                        "jobGroup": 2,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },
                    {
                        "jobGroup": 3,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },
                    {
                        "jobGroup": 4,
                        "protectedStatus": "",
                        "over2Sd": "",
                        "hiringRatioNonProtectedGroup": "",
                        "hiringRatioProtectedGroup": "",
                        "disparity": ""
                    },
                ]
            }
        ]
    },
    "terminations2P38": "In the 1.2 First/Mid-Level Managers and Officials there is adverse impact for veterans with 2.89 standard deviations where there were 112 non-vet employees with 14 terminations, compared to 11 veteran employees with 5 terminations.  This gave 4 more veteran terminations than expected.  ",
    "terminations3P38": "In the 3 Technicians job group there is adverse impact for minorities, Asians and Hispanics where there were 319 non-minority incumbents with 57 terminations as opposed to 69 minority incumbents with 28 terminated. This gave 13 more minority terminations than expected. For Asians there were 386 non-Asian incumbents with 2 terminations compared to having 2 Asians at the beginning of the year with 3 Asian terminations throughout the year.  This gave 3 more Asian terminations than expected giving 4.39 standard deviations. For Hispanics there were 35 Hispanic incumbents with 13 terminations, compared to 353 non-Hispanics with 67 terminations.",
    "terminations4P38": "Job group 4 Sales workers shows adverse impact for minorities, females, Asians and Hispanics. There were 11 Minority incumbents with 5 terminations compared to 105 non-minorities with 9 terminations, giving 4 more minority terminations than expected. Females show 3 more terminations than expected with 14 incumbents and 4 terminations giving 2.02 standard deviations.  For Asians, out of 116 incumbents, 115 were non-Asian with 13 terminations. Compared to 1 Asian incumbent who terminated. Hispanics show 4 incumbents with 3 terminations as opposed to the 112 non-Hispanics with 11 terminations.",
    "terminations5P38": "Finally, there was adverse impact for females in the 8 Laborers job group where there were 13 male employees with 0 terminations compared to 1 female employee that terminated giving 3.74 standard deviations or 1 more female termination than expected. ",
    "title1P38": "PRIOR YEAR GOALS- The following summarizes the 2012-2022 affirmative action goals identified for the past AAP years.  The table below identifies that both of last year’s goals have been met and there are no new goals.  The Company will make good faith efforts to maintain the current diversity this plan year.",
    "table10PriorP38": {
        "table": [
            {
                "year": "2021",
                "data": [
                    {
                        "jobGroup": "3 TECHNICIANS",
                        "protectedGroup": "ASIANS",
                        "goalMet": "YES",
                        "additionalGoal": "NONE"
                    },
                    {
                        "jobGroup": "8 LABORERS",
                        "protectedGroup": "FEMALES",
                        "goalMet": "YES",
                        "additionalGoal": "NONE"
                    }
                ]
            }
        ]
    },
    "table2PriorP39": {
        "table": [
            {
                "year": "2020",
                "data": [
                    {
                        "jobGroup": "3 TECHNICIANS",
                        "protectedGroup": "FEMALESASIANS",
                        "goalMet": "YES>",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "6 CRAFTS",
                        "protectedGroup": "FEMALES",
                        "goalMet": "YES",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "8 LABORERS",
                        "protectedGroup": "",
                        "goalMet": "",
                        "additionalGoal": "FEMALES"
                    }
                ]
            }
        ]
    },
    "table3PriorP39": {
        "table": [
            {
                "year": "2019",
                "data": [
                    {
                        "jobGroup": "2 PROFESIONALS",
                        "protectedGroup": "FEMALES",
                        "goalMet": "YES",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "3 TECHNICIANS",
                        "protectedGroup": "FEMALES",
                        "goalMet": "NO",
                        "additionalGoal": "ASIANS"
                    },
                    {
                        "jobGroup": "6 CRAFTS",
                        "protectedGroup": "",
                        "goalMet": "",
                        "additionalGoal": "FEMALES"
                    }
                ]
            }
        ]
    },
    "table4PriorP39": {
        "table": [
            {
                "year": "2018",
                "data": [
                    {
                        "jobGroup": "1.1 EXECUTIVES",
                        "protectedGroup": "FEMALESMINORITIES",
                        "goalMet": "",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "1.2 FIRST/MID-LEVEL",
                        "protectedGroup": "BLACKS",
                        "goalMet": "YES",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "2 PROFESSIONALS",
                        "protectedGroup": "",
                        "goalMet": "",
                        "additionalGoal": "FEMALES"
                    },
                    {
                        "jobGroup": "3 TECHNICIANS",
                        "protectedGroup": "FEMALES",
                        "goalMet": "NO",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "4 SALES",
                        "protectedGroup": "FEMALES",
                        "goalMet": "YES",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "8 LABORERS & HELPERS",
                        "protectedGroup": "",
                        "goalMet": "",
                        "additionalGoal": ""
                    }
                ]
            }
        ]
    },
    "table5PriorP39": {
        "table": [
            {
                "year": "2017",
                "data": [
                    {
                        "jobGroup": "1.1 EXECUTES",
                        "protectedGroup": "FEMALESMINORITIES",
                        "goalMet": "YESYES",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "1.2 FIRST/MID-LEVEL",
                        "protectedGroup": "BLACKS",
                        "goalMet": "NO",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "3 TECHNICIANS",
                        "protectedGroup": "FEMALES",
                        "goalMet": "NO",
                        "additionalGoal": "ASIANS"
                    },
                    {
                        "jobGroup": "4 SALES",
                        "protectedGroup": "FEMALES",
                        "goalMet": "NO",
                        "additionalGoal": "HISPANICS"
                    },
                    {
                        "jobGroup": "8 LABORERS & HELPERS",
                        "protectedGroup": "",
                        "goalMet": "",
                        "additionalGoal": "FEMALES"
                    }
                ]
            }
        ]
    },
    "table6PriorP39": {
        "table": [
            {
                "year": "2016",
                "data": [
                    {
                        "jobGroup": "1.1 EXECUTIVES",
                        "protectedGroup": "FEMALESMINORITIES",
                        "goalMet": "NONO",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "1.2 FIRST / MID-LEVEL",
                        "protectedGroup": "",
                        "goalMet": "",
                        "additionalGoal": "BLACKS"
                    },
                    {
                        "jobGroup": "3 TECHNICIANS",
                        "protectedGroup": "",
                        "goalMet": "",
                        "additionalGoal": "FEMALES"
                    },
                    {
                        "jobGroup": "4 SALES",
                        "protectedGroup": "FEMALES",
                        "goalMet": "NO",
                        "additionalGoal": ""
                    }
                ]
            }
        ]
    },
    "title1PriorP40": "PRIOR YEAR GOALS CONT.",
    "table7PriorP40": {
        "table": [
            {
                "year": "2015",
                "data": [
                    {
                        "jobGroup": "1.1 EXECUTIVES",
                        "protectedGroup": "FEMALESMINORITIES",
                        "goalMet": "NONO",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "4 SALES",
                        "protectedGroup": "FEMALES",
                        "goalMet": "NO",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "5 ADMINISTRATIVE SUPPORT",
                        "protectedGroup": "ASIANS",
                        "goalMet": "YES",
                        "additionalGoal": ""
                    }
                ]
            }
        ]
    },
    "tabl8PrioP40": {
        "table": [
            {
                "year": "2014",
                "data": [
                    {
                        "jobGroup": "1.1 EXECUTIVES",
                        "protectedGroup": "",
                        "goalMet": "",
                        "additionalGoal": "FEMALESMINORITIES"
                    },
                    {
                        "jobGroup": "1.2 FIRST / MID LEVEL MANAGERS",
                        "protectedGroup": "MINORITIESHISPANICS",
                        "goalMet": "YESYES",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "2 PROFESIONALS",
                        "protectedGroup": "BLACKS",
                        "goalMet": "YES",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "3 TECHNICIANS",
                        "protectedGroup": "FEMALESASIANS",
                        "goalMet": "YESYES",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "4 SALES WORKERS",
                        "protectedGroup": "FEMALESBLACKS",
                        "goalMet": "NOYES",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "5 ADMINISTRATIVE SUPPORT",
                        "protectedGroup": "ASIANS",
                        "goalMet": "NO",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "6 CRAFTS",
                        "protectedGroup": "FEMALES",
                        "goalMet": "YES",
                        "additionalGoal": ""
                    }
                ]
            }
        ]
    },
    "table9PriorP40": {
        "table": [
            {
                "year": "2013",
                "data": [
                    {
                        "jobGroup": "1.1 EXECUTIVESMANAGERS",
                        "protectedGroup": "FEMALESMINORITIES",
                        "goalMet": "YESYES",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "1.2 FIRST / MID LEVEL MANAGERS",
                        "protectedGroup": "MINORITIES",
                        "goalMet": "NO",
                        "additionalGoal": "HISPANICS"
                    },
                    {
                        "jobGroup": "2 PROFESIONALS",
                        "protectedGroup": "BLACKS",
                        "goalMet": "NO",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "3 TECHNICIANS",
                        "protectedGroup": "FEMALESMINORITIESHISPANICSASIANS",
                        "goalMet": "NOYESYESNO",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "4 SALES WORKERS",
                        "protectedGroup": "FEMALES",
                        "goalMet": "NO",
                        "additionalGoal": "BLACKS"
                    },
                    {
                        "jobGroup": "5 ADMINISTRATIVE SUPPORT",
                        "protectedGroup": "MINORITIESBLACKSHISPANICSASIANS",
                        "goalMet": "NO",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "6 CRAFTS",
                        "protectedGroup": "",
                        "goalMet": "",
                        "additionalGoal": "FEMALES"
                    }
                ]
            }
        ]
    },
    "title1P41": "PRIOR YEAR GOALS",
    "table10P41": {
        "table": [
            {
                "year": "2012",
                "data": [
                    {
                        "jobGroup": "1.1 EXECUTIVIES",
                        "protectedGroup": "FEMALESMINORITIES",
                        "goalMet": "NONO",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "1.2 FIRST/MID-LEVEL MANAGERS",
                        "protectedGroup": "FEMALESMINORITIESBLACKSHISPANICSASIANS",
                        "goalMet": "NOYESYESYESYES",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "2 PROFESIONALS",
                        "protectedGroup": "ASIANS",
                        "goalMet": "YES",
                        "additionalGoal": "BLACKS"
                    },
                    {
                        "jobGroup": "3 TECHNICIANS",
                        "protectedGroup": "FEMALESMINORITIESBLACKSHISPANICSASIANS",
                        "goalMet": "NONONONONO",
                        "additionalGoal": ""
                    },
                    {
                        "jobGroup": "4 SALES WORKERS",
                        "protectedGroup": "FEMALESMINORITIESASIANS",
                        "goalMet": "NOYESYES",
                        "additionalGoal": "BLACKS"
                    },
                    {
                        "jobGroup": "6 CRAFT WORKERS SUPPORT",
                        "protectedGroup": "BLACKS",
                        "goalMet": "NO",
                        "additionalGoal": "FEMALES"
                    },
                    {
                        "jobGroup": "7 OPERATIVES",
                        "protectedGroup": "",
                        "goalMet": "",
                        "additionalGoal": "FEMALESMINORITIES"
                    }
                ]
            }
        ]
    },
    "title2P41": "JOB AREA ACCEPTANCE RANGE ANALYSIS-A JAAR analysis was run by organizational unit to identify any potential underrepresentation or concentration by department.  (See charts Section III, JAAR, summarizing those findings.)",
    "table11P41": {
        "table": [
            {
                "data": [
                    {
                        "department": "ADMINISTRATION",
                        "underrepresentation": "",
                        "concentration": "15.41 SD FEMALES 2.43 SD MINORITIES",
                        "sizeOfDept": ""
                    },
                    {
                        "department": "SALES",
                        "underrepresentation": "8.46  FEMALES2.3 SD MINORITIES",
                        "concentration": "",
                        "sizeOfDept": "28 FEMALES OUT OF 217 TOTAL25 MINORITIES OUT OF 217 TOTAL"
                    },
                    {
                        "department": "OPERATIONS",
                        "underrepresentation": "2.97 SD FEMALES",
                        "concentration": "",
                        "sizeOfDept": "91 FEMALES OUT OF 929 TOTAL"
                    }
                ]
            }
        ]
    },
    "summary1P41": "An in-depth analysis was conducted that revealed that 3 Departments listed above had over 30 incumbents and over 2 standard deviations. Accordingly, managers in these Departments will be informed of the disparities and the company will continue to monitor the selection process to ensure equity in all personnel decisions.",
}

#Para reemplazar todas las imagenes
doc.replace_media("output/template/base_images/company_logo.png", "output/template/new_images/convergint.png")
doc.render(context)
# doc.save("../../frontend/}public/generSated_doc1112.docx")
doc.save("./output/output/archivo.docx")