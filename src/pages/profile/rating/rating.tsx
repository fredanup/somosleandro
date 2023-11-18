export default function Rating() {
  return (
    <>
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-medium text-black ">Calificaciones</h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center">
              <p className="inline-flex items-center rounded bg-blue-100 p-1.5 text-sm font-semibold text-blue-800 dark:bg-blue-200 dark:text-blue-800">
                25
              </p>
              <p className="ml-2 font-medium text-gray-900">Bueno</p>
            </div>
            <p className="text-sm font-medium text-gray-500">
              75 calificaciones
            </p>
          </div>
          <div className="flex flex-col w-full items-center">
            <div className="w-full">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Bueno
                </dt>
                <dd className="flex items-center">
                  <div className="mr-2 h-2.5 w-full rounded bg-gray-200">
                    <div className="h-2.5 w-24 rounded bg-blue-600"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-400">25</span>
                </dd>
              </dl>
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Regular
                </dt>
                <dd className="flex items-center">
                  <div className="mr-2 h-2.5 w-full rounded bg-gray-200">
                    <div className="h-2.5 w-24 rounded bg-blue-600"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-400">25</span>
                </dd>
              </dl>
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Malo
                </dt>
                <dd className="flex items-center">
                  <div className="mr-2 h-2.5 w-full rounded bg-gray-200">
                    <div className="h-2.5 w-24 rounded bg-blue-600"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-400">25</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
