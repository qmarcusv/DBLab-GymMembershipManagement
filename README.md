# DBLab-GymManagementSystem

# DESCRIPTION: GYM MANAGEMENT SYSTEM

## Entities and Relationships

### Entities

1. **Member**: Represents the customers who have gym memberships.
2. **Trainer**: Represents the fitness instructors or personal trainers.
3. **GymStore**: Represents all gym’s supplement stores that collaborate with the Gym system.
4. **GymBranch**: Represents all gym’s branches that collaborate with the Gym system.

### Weak Entities

**Membership**: Represents the type of membership a member holds (e.g., monthly, quarterly, annually).

### Relationships

1. **HasMembership**: Between `Member` and `Membership`
   - A member holds a specific type of gym membership.
   - **Attributes**: `CurrentDate`
2. **HasTrainer**: Between `Member` and `Trainer`
   - A member is assigned to a trainer for personal training sessions.
   - **Attributes**: `StartDate`, `EndDate`, `MemberID`, `TrainerID`
3. **PurchaseFrom**: Between `Member` and `GymStore`
   - A member can purchase products (e.g., supplements, gym equipment) from the gym store.
   - **Attributes**: `PurchaseDate`, `GymStoreID`, `MemberID`
4. **WorkAt**: Between `Trainer` and `GymBranch`
   - A trainer works at one or more gym branches.
   - **Attributes**: `TrainerID`, `GymBranchID`

## Attributes

### Member

- **MemberID**: Unique identifier for each member.
- **DoB**: Date of Birth of a member.
- **MemberName**: Full name of the member.
- **MemberPhoneNumber**: Contact information.
- **JoinDate**: Date when the member joined the gym.
- **Status**: Expired or Active

### Trainer

- **TrainerID**: Unique identifier for each trainer.
- **TrainerName**: Full name of the trainer.
- **Specialization**: Area of expertise (e.g., weight training, cardio).
- **TrainerPhoneNumber**: Contact information.

### Membership

- **Type**: Type of membership (e.g., monthly, annual).
- **Price**: The price of the membership.
- **Duration**: Duration of the membership (e.g., 1 month, 12 months).
- **StartDate**: The start day of membership.
- **EndDate**: Calculated as `StartDate + Duration`.

### GymStore

- **GymStoreID**: Unique identifier for each gym’s supplement store.
- **GymStoreName**: Name of the gym’s store.
- **PurchaseDate**: Purchase date when a member makes a purchase in a gym store.
- **DiscountAmount**: The percentage of discount for each store.

### GymBranch

- **GymBranchID**: Unique identifier for each gym’s branch.
- **Address**: Address of each branch.

## Constraints

### Primary Key Constraints

- **MemberID**, **TrainerID**, **MembershipID**, **GymStoreID**, **GymBranchID**

### Foreign Key Constraints

- `Payment.MemberID` references `Member(MemberID)`

### Check Constraints

- `Membership.Price` must be greater than zero.
