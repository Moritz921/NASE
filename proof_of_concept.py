import random

def main():
    applicants = [
        {
            "id": 1,
            "sNumber": "1234567",
            "preferences": {
                "locker": "LZ",
                "row": 1
            }
        },
        {
            "id": 2,
            "sNumber": "2345678",
            "preferences": {
                "locker": "Lounge"
            }
        },
        {
            "id": 3,
            "sNumber": "3456789",
            "preferences": {
                "row": 2
            }
        },
        {
            "id": 4,
            "sNumber": "4567890",
            "preferences": {
            }
        },
        {
            "id": 5,
            "sNumber": "5678901",
            "preferences": {
                "locker": "LZ",
                "row": 1
            }
        },
        {
            "id": 6,
            "sNumber": "6789012",
            "preferences": {
                "locker": "LZ",
                "row": 1
            }
        },
        {
            "id": 7,
            "sNumber": "7890123",
            "preferences": {
                "locker": "LZ",
                "row": 1
            }
        }
    ]

    allocation(applicants)


def allocation(applicants: dict):
    # (0,0) is bottom left, (rows, columns)
    available_lockers = {
        "LZ": {
            "rows": 4,
            "columns": 3,
            "excluded": []
        },
        "Lounge": {
            "rows": 4,
            "columns": 4,
            "excluded": [(3,0)]
        }
    }
    nr_available_lockers = sum(
        (locker_info["rows"] * locker_info["columns"]) - len(locker_info["excluded"])
        for locker_info in available_lockers.values()
    )

    # Speichere (row, col, user_id) für jedes zugewiesene Schließfach
    assigned_lockers = {"LZ": [], "Lounge": []}

    if len(applicants) > nr_available_lockers:
        # Not enough lockers available
        # remove excess applicants randomly
        applicants = random.sample(applicants, nr_available_lockers)
    random.shuffle(applicants)

    # get only applicants with both preferences for locker and row
    both_preferences = [
        applicant for applicant in applicants
        if "locker" in applicant["preferences"] and "row" in applicant["preferences"]
    ]
    locker_preferences = [
        applicant for applicant in applicants
        if "locker" in applicant["preferences"] and "row" not in applicant["preferences"]
    ]
    row_preferences = [
        applicant for applicant in applicants
        if "row" in applicant["preferences"] and "locker" not in applicant["preferences"]
    ]
    no_preferences = [
        applicant for applicant in applicants
        if "row" not in applicant["preferences"] and "locker" not in applicant["preferences"]
    ]

    print(f"Applicants with both preferences: {both_preferences}")
    print(f"Applicants with locker preference: {locker_preferences}")
    print(f"Applicants with row preference: {row_preferences}")
    print(f"Applicants with no preferences: {no_preferences}")


    for applicant in both_preferences:
        locker_type = applicant["preferences"]["locker"]
        row = applicant["preferences"]["row"]
        if locker_type in available_lockers:
            locker_info = available_lockers[locker_type]
            if 0 <= row < locker_info["rows"]:
                col_list = list(range(locker_info["columns"]))
                random.shuffle(col_list)
                assigned = False
                for col in col_list:
                    if (row, col) not in locker_info["excluded"] and all(lc[:2] != (row, col) for lc in assigned_lockers[locker_type]):
                        assigned_lockers[locker_type].append((row, col, applicant["id"]))
                        print(f"Assigned locker {locker_type} at ({row}, {col}) to applicant {applicant['sNumber']}")
                        assigned = True
                        break
                if not assigned:
                    print(f"No available lockers in row {row} for applicant {applicant['sNumber']}. Removing row preference, keeping locker preference...")
                    new_applicant = applicant.copy()
                    new_applicant["preferences"] = new_applicant["preferences"].copy()
                    del new_applicant["preferences"]["row"]
                    locker_preferences.append(new_applicant)
            else:
                print(f"Invalid row {row} for locker type {locker_type}. Removing row preference, keeping locker preference...")
                new_applicant = applicant.copy()
                new_applicant["preferences"] = new_applicant["preferences"].copy()
                del new_applicant["preferences"]["row"]
                locker_preferences.append(new_applicant)
        else:
            print(f"Invalid locker type {locker_type}. Removing locker preference...")
            row_preferences.append(applicant)

    for applicant in locker_preferences:
        locker_type = applicant["preferences"]["locker"]
        if locker_type in available_lockers:
            locker_info = available_lockers[locker_type]
            row_list = list(range(locker_info["rows"]))  # iterate random rows
            random.shuffle(row_list)
            assigned = False
            for row in row_list:
                col_list = list(range(locker_info["columns"]))  # iterate random columns
                random.shuffle(col_list)
                for col in col_list:
                    if (row, col) not in locker_info["excluded"] and all(lc[:2] != (row, col) for lc in assigned_lockers[locker_type]):
                        assigned_lockers[locker_type].append((row, col, applicant["id"]))
                        print(f"Assigned locker {locker_type} at ({row}, {col}) to applicant {applicant['sNumber']}")
                        assigned = True
                        break
                if assigned:
                    break
            if not assigned:
                print(f"No available lockers in locker type {locker_type} for applicant {applicant['sNumber']}. Removing locker preference...")
                no_preferences.append(applicant)
        else:
            print(f"Invalid locker type {locker_type}. Removing locker preference...")
            no_preferences.append(applicant)

    for applicant in row_preferences:
        row = applicant["preferences"]["row"]
        # create list of all lockers with that row
        possible_lockers = []
        for locker_type, locker_info in available_lockers.items():
            if 0 <= row < locker_info["rows"]:
                col_list = list(range(locker_info["columns"]))
                random.shuffle(col_list)
                for col in col_list:
                    if (row, col) not in locker_info["excluded"] and all(lc[:2] != (row, col) for lc in assigned_lockers[locker_type]):
                        possible_lockers.append((locker_type, (row, col)))
        if possible_lockers:
            locker_type, (row, col) = random.choice(possible_lockers)
            assigned_lockers[locker_type].append((row, col, applicant["id"]))
            print(f"Assigned locker {locker_type} at ({row}, {col}) to applicant {applicant['sNumber']}")
        else:
            print(f"No available lockers in row {row} for applicant {applicant['sNumber']}. Removing row preference...")
            no_preferences.append(applicant)

    for applicant in no_preferences:
        locker_list = list(available_lockers.keys())
        random.shuffle(locker_list)
        assigned = False
        for locker in locker_list:
            locker_info = available_lockers[locker]
            row_list = list(range(locker_info["rows"]))
            random.shuffle(row_list)
            for row in row_list:
                col_list = list(range(locker_info["columns"]))
                random.shuffle(col_list)
                for col in col_list:
                    if (row, col) not in locker_info["excluded"] and all(lc[:2] != (row, col) for lc in assigned_lockers[locker]):
                        assigned_lockers[locker].append((row, col, applicant["id"]))
                        print(f"Assigned locker {locker} at ({row}, {col}) to applicant {applicant['sNumber']}")
                        assigned = True
                        break
                if assigned:
                    break
            if assigned:
                break
        if not assigned:
            print(f"No available lockers for applicant {applicant['sNumber']}. This should not happen.")
    print(f"Final assigned lockers: {assigned_lockers}")



if __name__ == "__main__":
    main()
