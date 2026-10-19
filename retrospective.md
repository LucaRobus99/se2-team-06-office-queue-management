TEMPLATE FOR RETROSPECTIVE (Team 6)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done 
- Total points committed vs done 
- Nr of hours planned vs spent (as a team)

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on Git
- End-to-End tests performed

> Please refine your DoD 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
|   #0   |    8    |    -   |  23h 00m   |    23h 50m   |
|    1   |   11    |    3   |  17h 30m   |    18h 55m   |
   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)

|            | Mean   | StDev    |
|------------|--------|----------|
| Estimation | 2h 08m |  1h 39m  | 
| Actual     | 2h 15m |  1h 44h  |

- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

    $$\frac{\sum_{i=1}^{19} spent_{task_i}}{\sum_{i=1}^{19} estimation_{task_i}} - 1 = \frac{42.75}{40.5} - 1 \approx 0.0556 = 5.56\% $$

    
- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

$$\frac{1}{19}\sum_{i=1}^{19}\left|\frac{spent_{task_i}}{estimation_{task_i}}-1\right| \approx 0.2061 = 20.61\%$$

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated
  - Total hours spent
  - Nr of automated unit test cases 
  - Coverage
- E2E testing:
  - Total hours estimated
  - Total hours spent
  - Nr of test cases
- Code review 
  - Total hours estimated 
  - Total hours spent  


| type of test  | Hours est. | Hours actual | automated unit test case | coverage |
|---------------|------------|--------------|--------------------------|----------|
|   unit test   |   2h 00m   |     3h 10m   |             37           |    92.3% |
|    E2E test   |   2h 00m   |     3h 00m   |             14           |     -    |
|  code review  |   1h 00m   |     1h 10m   |              -           |     -    |

## ASSESSMENT



- What caused your errors in estimation (if any)?

  - **F:** I needed extra time that I had not planned for to learn how to use new database and testing libraries.
  - **L:** I underestimated the time required for testing because I had never worked with end-to-end (E2E) tests and had to learn Playwright from scratch. My tests covered E2E flows on the backend side only, without interacting with a real frontend.
  - **G:** We underestimated the time needed to define the overall application architecture and translate theory into implementation, as the first User Story required decisions that affected the entire system. On the other hand, we overestimated backend development time because we were already familiar with many of the tools from previous courses.
  - **J:** We had to make several assumptions at the beginning because the requirements were not fully defined. We spent more time on decision-making than on actual development, which led us to overestimate development tasks and slightly underestimate design tasks.

- What lessons did you learn (both positive and negative) in this sprint?

  - **L:** I learned how to use Playwright to test backend flows and realized that we should include time for learning new frameworks and tools in our estimations.
  - **F:** I learned how to collaborate with my new team and improve our workflow within a single week.
  - **G:** We learned that good organization makes development easier, but planning everything in advance is not always effective, as new challenges arise along the way. We also realized the importance of clarifying requirements with the Product Owner at the beginning of the sprint instead of making assumptions ourselves.
  - **J:** Clear and well-defined requirements lead to more effective sprint execution. We should establish a good Definition of Ready after refining tasks and take it into account when planning the sprint.

- Which improvement goals set in the previous retrospective were you able to achieve?

  - **G:** As this was our first sprint, we had no previous improvement goals.
  - **L:** As this was our first sprint, we had no previous improvement goals.
  - **F:** I almost stayed within the 10-hour time limit while completing all my assigned tasks.
  - **J:** As this was our first sprint, we had no previous improvement goals.

- Which ones were you not able to achieve? Why?

  - **L:** As this was our first sprint, we had no previous improvement goals.
  - **F:** I would like to involve myself more in team discussions, especially when making decisions about the project structure, so that we can define it together.
  - **G:** As this was our first sprint, we had no previous improvement goals.
  - **J:** As this was our first sprint, we had no previous improvement goals.

- Improvement goals for the next sprint and how to achieve them

  - **G:**
    1. Track working hours more consistently by updating YouTrack after each work session.
    2. Improve task estimations by accounting for the time needed for organization, coordination, and learning new tools.

  - **F:** Improve task separation and clarify individual roles and responsibilities to make collaboration more effective.

  - **L:** Focus more on backend tasks, where I can contribute more effectively, and set up Playwright at the beginning of the sprint to make E2E testing more consistent.

  - **J:** Improve task estimations by taking into account our experience from the first sprint and our understanding of each team member's technical background and delivery speed.

- One thing you are proud of as a team!

  - **L:** I'm proud of how well we collaborated and organized our work. We delivered a solid first version of the application, starting completely from scratch.
  - **F:** I'm proud that we worked so well together despite being a small team and not knowing each other beforehand.
  - **G:** We are proud that, despite having different backgrounds and ideas, we managed to communicate effectively, discuss different perspectives, and find solutions that worked well for everyone.
  - **J:** We delivered all our tasks within the sprint, the sprint demo went well, and we successfully demonstrated a working flow for the User Story we had committed to.