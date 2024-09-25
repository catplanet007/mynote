smem - Report memory usage with shared memory divided proportionally.

smem  reports physical memory usage, taking shared memory pages into account.  Unshared memory is reported as the USS (Unique Set Size).  Shared memory is divided evenly among the processes sharing that memory.  The unshared memory (USS) plus a process's proportion of shared memory is reported as the PSS (Proportional Set Size).  The USS and PSS only include physical memory usage.  They do not include memory that has been swapped out to disk.

Memory can be reported by process, by user, by mapping, or systemwide.  Both text mode and graphical output are available.


```shell
$ smem --help
Usage: smem [options]

Options:
  -h, --help            show this help message and exit
  -H, --no-header       disable header line
  -c COLUMNS, --columns=COLUMNS
                        columns to show
  -t, --totals          show totals
  -a, --autosize        size columns to fit terminal size
  -R REALMEM, --realmem=REALMEM
                        amount of physical RAM
  -K KERNEL, --kernel=KERNEL
                        path to kernel image
  -m, --mappings        show mappings
  -u, --users           show users
  -w, --system          show whole system
  -P PROCESSFILTER, --processfilter=PROCESSFILTER
                        process filter regex
  -M MAPFILTER, --mapfilter=MAPFILTER
                        map filter regex
  -U USERFILTER, --userfilter=USERFILTER
                        user filter regex
  -n, --numeric         numeric output
  -s SORT, --sort=SORT  field to sort on
  -r, --reverse         reverse sort
  -p, --percent         show percentage
  -k, --abbreviate      show unit suffixes
  --pie=PIE             show pie graph
  --bar=BAR             show bar graph
  -S SOURCE, --source=SOURCE
                        /proc data source
```